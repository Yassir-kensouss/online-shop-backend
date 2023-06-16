const Product = require("../models/product");

exports.isProductExist = (req, res, next, id) => {
  console.log("id", id);
  Product.findOne({ _id: id }).exec((error, product) => {
    if (error || !product) {
      return res.status(400).json({
        error: "Product not exist",
      });
    }

    req.product = product;

    next();
  });
};
