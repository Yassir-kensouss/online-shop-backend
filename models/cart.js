const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
  ],
  quantities: [
    {
      type: Number,
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
}, {timestamps: true});

module.exports = mongoose.model('Cart', cartSchema)