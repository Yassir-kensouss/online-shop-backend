const User = require("../models/user");
const jwt = require('jsonwebtoken')

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

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

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

exports.signout = (req,res) => {

    res.clearCookie('token');

    res.send({
        message: 'User signed out'
    })

}