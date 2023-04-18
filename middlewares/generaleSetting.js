const GeneraleSetting = require("../models/generaleSetting");

exports.getGeneraleSettings = (req, res, next, id) => {
  GeneraleSetting.findById(id).exec((err, settings) => {
    if (err || !settings) {
      return res.status(404).json({
        error: "Settings not found",
      });
    }

    req.generaleSettings = settings;

    next();
  });
};
