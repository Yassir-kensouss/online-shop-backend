const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "128474420027-3cmf1ufttlh5ff8nfniebuqjtm4skard.apps.googleusercontent.com"
);

exports.salam = (req, res) => {
  res.send("app is in /");
};

exports.signup = (req, res) => {
  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          error: "Email is already exists",
        });
      }
      return res.status(400).send(err);
    }

    res.send(user);
  });
};

exports.signin = (req, res) => {
  const { password, email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found with this email, please sign up",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email or password incorrect",
      });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, { expire: new Date() + 8900083774 });

    const { _id, name, email, role } = user;

    return res.send({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  });
};

exports.signInWithGoogle = async (req, res) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  let user = await User.findOne({ email: email });

  if (!user) {
    user = await new User({
      email,
      name,
      password: "123098777",
    });

    await user.save();
  }

  res.status(201);
  res.json({ token, user });
};

exports.signout = (req, res) => {
  res.clearCookie("token");

  res.send({
    message: "User signed out",
  });
};
