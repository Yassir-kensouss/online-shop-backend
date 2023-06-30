const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;
const moment = require("moment");
const currentDate = moment().format("MM/DD/YY");

const CartItemSchema = new mongoose.Schema(
  {
    color: String,
    size: String,
    vid: String,
    originalPrice: Number,
    photos: Array,
    productId: { type: ObjectId, ref: "Product" },
    name: String,
    price: Number,
    quantity: Number,
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", CartItemSchema);

const AddressSchema = new mongoose.Schema({
  address: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  zip_code: { type: String, required: true, trim: true },
  country_code: { type: String, required: true, trim: true },
});

const OrderSchema = new mongoose.Schema(
  {
    products: [CartItemSchema],
    transaction_id: { type: String },
    totalPrice: { type: Number },
    shipping: {
      type: Object,
    },
    address: { type: AddressSchema },
    date: {
      type: Date,
      default: currentDate,
    },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
    updated: Date,
    user: { type: ObjectId, ref: "User" },
    browser: { type: String, trim: true },
    device: { type: String, trim: true },
    os: { type: String, trim: true },
    country: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, CartItem };
