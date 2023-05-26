const Brands = require("../models/brands");
const HeroCarousals = require("../models/hero_carousal");
const { cloudinary } = require("../utils/cloudinary");

exports.addHeroCarousalSlide = async (req, res) => {
  const file = req.body.photo;
  const result = await cloudinary.uploader.upload(file, {
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

exports.fetchHeroCarousals = (req, res) => {
  HeroCarousals.find().exec((err, slides) => {
    if (err || !slides) {
      return res.status(400).json({
        message: err,
      });
    }

    res.json({
      slides,
    });
  });
};

exports.deleteHeroCarousalSlide = (req, res) => {
  const _id = req.query._id;

  HeroCarousals.deleteOne({ _id: _id }).exec((err, slide) => {
    if (err || !slide) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      slide,
    });
  });
};

exports.editHeroCarousalSlide = async (req, res) => {
  const _id = req.query._id;

  if (!req.body.photo.includes("https")) {
    const file = req.body.photo;
    const result = await cloudinary.uploader.upload(file, {
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
  } else {
    req.body = {
      ...req.body,
    };
  }

  HeroCarousals.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        ...req.body,
      },
    },
    { new: true }
  )
    .then(slide => {
      res.json({
        slide,
      });
    })
    .catch(error => {
      res.status(500).send(error);
    });
};

exports.addBrandLogo = async (req, res) => {
  const file = req.body.photo;
  const result = await cloudinary.uploader.upload(file);

  req.body = {
    ...req.body,
    photo: result.secure_url,
  };

  const carousal = new Brands(req.body);
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

exports.fetchBrands = (req, res) => {
  Brands.find().exec((err, result) => {
    if (err || !result) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      brands: result,
    });
  });
};

exports.deleteBrands = (req, res) => {
  const _id = req.query._id;

  Brands.deleteOne({ _id: _id }).exec((err, result) => {
    if (err || !result) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      message: "Brand deleted successfully",
    });
  });
};
