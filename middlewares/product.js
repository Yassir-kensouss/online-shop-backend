const Product = require("../models/product");

exports.updateProductStock = (req, res, next) => {
  let bulkOps = req.body.products.map(product => {
    const stockAmount = product.stockQte - product.quantity;
    const stock = stockAmount > 0 ? true : false;

    return {
      updateOne: {
        filter: { _id: product.productId },
        update: {
          $inc: { quantity: -product.quantity, sold: +product.quantity },
          $set: { stock: stock },
        },
      },
    };
  });

  Product.bulkWrite(bulkOps, (err, products) => {
    if (err || !products) {
      return res.status(400).json({
        error: err,
      });
    }
  });
  next();
};
