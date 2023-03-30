const { USER_HISTORY_TYPES } = require("../config/constants");
const { Order } = require("../models/order");
const { saveUserHistory } = require("./userController");

exports.createOrder = (req, res) => {
  req.body = {
    ...req.body,
    user: req.profile,
  };

  const order = new Order(req.body);

  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      order,
    });

    saveUserHistory({
      userId: req.profile,
      userHistory: {
        userActivity: USER_HISTORY_TYPES.NEW_PURCHASE,
        date: new Date(),
        content: [...req.body.products],
      },
    });
  });
};

exports.fetchOrders = async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10; 
  const page = req.query.page ? req.query.page : 1; 
  const skip = limit * page;
  const count = await Order.countDocuments();
  Order.find()
    .skip(skip)
    .limit(limit)
    .populate("user", "_id name email")
    .sort("-createdAt")
    .exec((error, orders) => {
      if (error) {
        return res.status(400).json({
          error: error,
        });
      }

      res.json({
        orders,
        count,
      });
    });
};

exports.getStatus = (req, res) => {
  res.json({ status: Order.schema.path("status").enumValues });
};

exports.changeOrderStatus = (req, res) => {
  Order.update({ _id: req.order._id }, { $set: { status: req.body.status } }).exec(
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      res.json({
        order: order,
        message: "order state updated successfully",
      });
    }
  );
};
