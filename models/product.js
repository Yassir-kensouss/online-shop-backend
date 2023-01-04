const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 200,
      require: true,
    },
    description: {
      type: String,
      maxlength: 10000,
      require: true,
    },
    shortdescription: {
      type: String,
      maxlength: 2000,
      require: true,
    },
    oldprice: {
      type: Number,
    },
    price: {
      type: Number,
      require: true,
    },
    sku: {
      type: String,
    },
    visibility: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    photos: [{
      type: ObjectId,
      ref: 'FileStorage',
      require: true,
    }],
    category: [{
      type: ObjectId,
      ref:'Category',
      require: true,
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
