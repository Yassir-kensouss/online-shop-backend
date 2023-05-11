const mongoose = require("mongoose");

const heroCarousalsSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    sub_caption: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    link: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroCarousals", heroCarousalsSchema);
