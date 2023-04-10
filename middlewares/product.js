const Product = require("../models/product");

exports.updateProductStock = (req, res, next) => {
  let bulkOps = req.body.products.map(product => {

    const stock = product.quantity - product.count <= 0 ? false : true

    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: {quantity: -product.count, sold: +product.count}, $set: {stock} },
      },
    };
  });

  Product.bulkWrite(bulkOps, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    next()
  });
};
