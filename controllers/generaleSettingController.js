const GeneraleSetting = require("../models/generaleSetting");
const { cloudinary } = require("../utils/cloudinary");

exports.saveGeneraleSettings = (req, res) => {
  req.body = {
    ...req.body,
    brand:
      "https://res.cloudinary.com/djilpfqae/image/upload/v1681729139/logo2_sbcm0t.png",
    currency: "$",
    language: "english",
    websiteDescription: "web site description",
    websiteTitle: "web site title",
  };

  const generaleSetting = new GeneraleSetting(req.body);

  generaleSetting.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      result,
    });
  });
};

exports.updateGeneraleSettings = async (req, res) => {
  const generaleSettings = req.generaleSettings;

  let result = null;

  if (req.body.brand) {
    const file = req.body.brand;
    result = await cloudinary.uploader.upload(file, {
      crop: "fill",
      width: 35, // set your desired width here
      height: 35, // set your desired height here
      gravity: "center",
      format: "jpg",
      quality: "auto",
      secure: true,
      cropMode: "limit",
    });
  }

  GeneraleSetting.findOneAndUpdate(
    { _id: generaleSettings._id },
    {
      $set: {
        ...req.body,
        brand: result !== null ? result.secure_url : generaleSettings.brand,
      },
    }
  )
    .then(data => {
      res.json({
        result: data,
      });
    })
    .catch(err => {
      return res.status(400).json({
        error: err,
      });
    });
};

exports.fetchGeneraleSettings = (req, res) => {
  GeneraleSetting.find().exec((err, data) => {
    if (err || !data) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      data: data[0],
    });
  });
};
