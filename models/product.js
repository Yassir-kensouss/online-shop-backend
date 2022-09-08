const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

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
      maxlength: 2000,
      require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    quantity: {
        type: Number,
    },
    photo: {
      data: Buffer,
      contentType: String,
    //   require: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema)