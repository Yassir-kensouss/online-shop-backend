const { Order } = require("../models/order");

exports.orderById = (req, res, next, id) => {
  Order.findById(id).exec((err, order) => {
    if (err) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    req.order = order;
  });
  next();
};
