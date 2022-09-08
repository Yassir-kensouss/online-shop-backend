const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      res.send.status(404).json({
        error: "User not found",
      });
    }

    req.profile = user;

    next();
  });
};
