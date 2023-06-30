const { USER_HISTORY_TYPES } = require("../config/constants");
const { Order } = require("../models/order");
const { saveUserHistory } = require("./userController");
const useragent = require("useragent");
const DeviceDetector = require("node-device-detector");

exports.createOrder = async (req, res) => {
  console.log("req.body", req.body);

  const userAgent = useragent.parse(req.headers["user-agent"]);

  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });
  const result = detector.detect(userAgent.source);

  req.body = {
    ...req.body,
    user: req.profile,
    device: result.device.type,
    browser: result.client.name,
    os: result.os.name,
    country: req.body.address.country,
    country_code: req.body.address.country_code,
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

    req.app.emit("new-order");

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
  const newOrders = await Order.countDocuments({ status: "Not processed" });
  const delivered = await Order.countDocuments({ status: "Delivered" });
  const cancelled = await Order.countDocuments({ status: "Cancelled" });
  const processing = await Order.countDocuments({ status: "Processing" });
  Order.find()
    .skip(skip)
    .limit(limit)
    .populate("user", "_id name email")
    .sort("-createdAt")
    .exec((error, orders) => {
      if (error || !orders) {
        return res.status(400).json({
          error: error,
        });
      }

      res.json({
        orders,
        count,
        newOrders,
        delivered,
        cancelled,
        processing,
      });
    });
};

exports.getStatus = (req, res) => {
  res.json({ status: Order.schema.path("status").enumValues });
};

exports.changeOrderStatus = (req, res) => {
  Order.update(
    { _id: req.order._id },
    { $set: { status: req.body.status } }
  ).exec((err, order) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      order: order,
      message: "order state updated successfully",
    });
  });
};

exports.searchOrder = async (req, res) => {
  const field = req.query.field;
  const valToSearch =
    field === "transaction_id" ? "transaction_id" : "user.name";

  const value = req.query.search;
  const limit = req.query.limit ? req.query.limit : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = page * limit;
  const matching = new RegExp(value, "i");
  const count = await Order.countDocuments({
    [valToSearch]: { $regex: matching },
  });

  Order.find({ [valToSearch]: { $regex: matching } })
    .skip(skip)
    .limit(limit)
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      res.json({
        orders: result,
        count,
      });
    });
};

exports.ordersByFilters = async (req, res) => {
  const filters = req.body;
  const limit = req.query.limit ? req.query.limit : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = page * limit;
  const count = await Order.countDocuments(filters);

  Order.find(filters)
    .skip(skip)
    .limit(limit)
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      res.json({
        orders: result,
        count,
      });
    });
};
