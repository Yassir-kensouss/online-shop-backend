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
        content: [
            ...req.body.products
        ]
      },
    });

  });
};
