const User = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const Joi = require("joi");
const { cloudinary } = require("../utils/cloudinary");
const formidable = require("formidable");
const { saveUserHistory } = require("./userController");
const { USER_HISTORY_TYPES } = require("../config/constants");
const client = new OAuth2Client(process.env.CLIENT_ID);

exports.signup = async (req, res) => {
  const validationSchema = Joi.object({
    name: Joi.string().max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    state: Joi.string(),
    about: Joi.string().optional(),
    role: Joi.number(),
    avatar: Joi.string().allow("").optional(),
    address: Joi.object(),
    phone: Joi.string(),
    mobile: Joi.string(),
  });

  const validationError = validationSchema.validate(req.body);

  if (validationError.error) {
    return res.status(400).json({
      error: validationError.error.details[0].message,
    });
  }

  if (req.body.avatar) {
    const file = req.body.avatar;
    cloudinary.uploader.upload(file, (error, result) => {
      if (error) {
        return res.status(400).json({
          message: error,
        });
      }

      const user = new User({
        avatar: result.secure_url,
        ...req.body,
      });

      saveUser(user);
    });
  } else {
    const user = new User({
      ...req.body,
    });

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
  }

  const saveUser = user => {
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

    const { _id, name, email, role, avatar } = user;

    saveUserHistory({
      userId: _id,
      userHistory: {
        userActivity: USER_HISTORY_TYPES.USER_LOGGED_IN,
        date: new Date(),
      },
    });

    return res.send({
      token,
      user: {
        _id,
        name,
        email,
        role,
        avatar,
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

  const userId = req.params.userId;

  res.send({
    message: "User signed out",
  });

  saveUserHistory({
    userId,
    userHistory: {
      userActivity: USER_HISTORY_TYPES.USER_LOGGED_OUT,
      date: new Date(),
    },
  });
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User with this email not exist");

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `http://localhost:3000/update-password/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account.");
  } catch (error) {
    res.send("An error occured");
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(400).send("Invalid link or expired");
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send("Invalid link or expired");

    user.password = req.body.password;
    await user.save();
    await token.delete();

    res.send("password reset successfully");
  } catch (error) {
    res.send("Somthing went wrong!");
  }
};
