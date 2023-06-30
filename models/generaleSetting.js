const mongoose = require("mongoose");

const generaleSettingSchema = mongoose.Schema({
  brand: {
    type: String,
    required: true,
    default:
      "https://res.cloudinary.com/djilpfqae/image/upload/v1681729139/logo2_sbcm0t.png",
  },
  currency: {
    type: String,
    required: true,
    default: "$",
  },
  language: {
    type: String,
    required: true,
    default: "english",
  },
  websiteDescription: {
    type: String,
  },
  websiteTitle: {
    type: String,
  },
});

module.exports = mongoose.model("GeneraleSetting", generaleSettingSchema);
