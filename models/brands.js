const mongoose = require("mongoose");

const brandsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    photo: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brands", brandsSchema);
