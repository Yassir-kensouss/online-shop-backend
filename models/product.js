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
      maxlength: 100000,
      require: true,
    },
    shortDescription: {
      type: String,
      maxlength: 1000,
      require: true,
    },
    oldprice: {
      type: Number,
    },
    price: {
      type: Number,
      require: true,
      max: 1000000,
    },
    sku: {
      type: String,
      maxlength: 30,
    },
    visibility: {
      type: String,
    },
    quantity: {
      type: Number,
      min: 0,
      max: 500000,
      required: true,
    },
    photos: [{
      type: Object,
      required: true
    }],
    categories: [{
      type: Object,
      ref:'Category',
      require: true,
    }],
    tags: [{
      type: String
    }],
    sold:{
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
