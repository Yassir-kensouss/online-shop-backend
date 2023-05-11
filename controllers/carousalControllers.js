const HeroCarousals = require("../models/hero_carousal");
const { cloudinary } = require("../utils/cloudinary");

exports.addHeroCarousalSlide = async (req, res) => {
  const file = req.body.brand;
  result = await cloudinary.uploader.upload(file, {
    crop: "fill",
    width: 1112, // set your desired width here
    height: 500, // set your desired height here
    gravity: "center",
    format: "jpg",
    quality: "auto",
    secure: true,
    cropMode: "limit",
  });

  req.body = {
    ...req.body,
    photo: result.secure_url,
  };

  const carousal = new HeroCarousals(req.body);
  carousal.save((err, result) => {
    if (err || !result) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }

    res.json({
      result,
    });
  });
};
