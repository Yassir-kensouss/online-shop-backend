const { Order } = require("../models/order");
const User = require("../models/user");
const moment = require("moment");
const emojiFlags = require("emoji-flags");
const countries = require("../utils/countries.json");
const Product = require("../models/product");

exports.calculateRevenues = async (req, res) => {
  const currentDate = new Date();
  const periodTime = 24 * 60 * 60 * 1000;
  const fromDate = new Date(currentDate - periodTime);
  const last48hour = new Date(currentDate - periodTime * 2);

  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();
  const usersCount = await User.countDocuments();
  const newOrdersCount = await Order.countDocuments({
    createdAt: { $gte: fromDate },
  });
  const newUsersCount = await User.countDocuments({
    createdAt: { $gte: fromDate },
  });
  const last48hourUsers = await User.countDocuments({
    createdAt: { $lte: fromDate, $gte: last48hour },
  });
  const last48hourOrders = await User.countDocuments({
    createdAt: { $lte: fromDate, $gte: last48hour },
  });

  Order.find().exec((err, orders) => {
    if (err || !orders) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }

    const totalRevenue = orders
      .filter(order => order.status === "Delivered")
      .reduce((acc, order) => acc + order.totalPrice, 0);

    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({
      totalRevenue,
      totalSales,
      totalUsers: usersCount,
      totalOrders: ordersCount,
      newOrders: {
        value: newOrdersCount,
        rate: newOrdersCount > last48hourOrders ? 1 : 0,
      },
      newUsers: {
        value: newUsersCount,
        rate: newUsersCount > last48hourUsers ? 1 : 0,
      },
      productsCount,
    });
  });
};

exports.totalRevenueInterval = async (req, res) => {
  const interval = req.query.interval;
  let dateFormat;
  if (interval === "day") {
    dateFormat = "%Y-%m-%d";
  } else if (interval === "month") {
    dateFormat = "%Y-%m";
  } else if (interval === "year") {
    dateFormat = "%Y";
  } else {
    return res.status(400).json({
      error: "Invalid interval format",
    });
  }
  const totalPricePipeline = [
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        totalPrice: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalPrice: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ];

  const totalRevenuePipeline = [
    {
      $match: { status: "Delivered" },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalRevenue: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ];

  try {
    const totalPrice = await Order.aggregate(totalPricePipeline);
    const totalRevenue = await Order.aggregate(totalRevenuePipeline);
    const chartData = {
      labels: totalPrice.map(item =>
        moment(item.date).format(interval === "day" ? "MMM DD" : "MMM YYYY")
      ),
      datasets: [
        {
          label: "Total Sales",
          data: totalPrice.map(item => item.totalPrice),
          backgroundColor: "#6366f1",
          borderColor: "#6366f1",
          borderWidth: 2,
          tension: 0.5,
        },
        {
          label: "Total Revenue",
          data: totalRevenue.map(item => item.totalRevenue),
          backgroundColor: "#e6af2e",
          borderColor: "#e6af2e",
          borderWidth: 2,
          tension: 0.5,
        },
      ],
    };

    res.json({
      chartData,
    });
  } catch (error) {
    console.log("error", error);
  }
};

exports.browserTraffic = async (req, res) => {
  Order.find().exec((err, orders) => {
    if (err || !orders) {
      return res.status(400).json({
        error: err,
      });
    }

    const browsers = {
      chrome: 0,
      opera: 0,
      IE: 0,
      safari: 0,
      firefox: 0,
      unknown: 0,
      me: 0,
    };

    orders.map(order => {
      if (order.browser?.includes("Chrome")) {
        browsers.chrome = browsers.chrome + 1;
      } else if (order.browser?.includes("Opera")) {
        browsers.opera = browsers.opera + 1;
      } else if (order.browser?.includes("IE")) {
        browsers.IE = browsers.IE + 1;
      } else if (order.browser?.includes("Firefox")) {
        browsers.firefox = browsers.firefox + 1;
      } else if (order.browser?.includes("Safari")) {
        browsers.safari = browsers.safari + 1;
      } else if (order.browser === null || order.browser === "browser") {
        browsers.unknown = browsers.unknown + 1;
      } else if (order.browser?.includes("Microsoft Edge")) {
        browsers.me = browsers.me + 1;
      }
    });

    const sortedObj = {};

    Object.keys(browsers)
      .sort((a, b) => browsers[b] - browsers[a])
      .forEach(key => {
        sortedObj[key] = browsers[key];
      });

    const chartData = {
      labels: Object.keys(sortedObj).map(el => {
        return el;
      }),
      datasets: [
        {
          label: "Browsers",
          data: Object.keys(sortedObj).map(el => sortedObj[el]),
          backgroundColor: "#6366f1",
        },
      ],
    };

    res.json({
      chartData,
    });
  });
};

exports.deviceTraffic = async (req, res) => {
  const pipeline = [
    { $match: { device: { $exists: true, $ne: null } } },
    {
      $group: { _id: { $ifNull: ["$device", "Unknown"] }, count: { $sum: 1 } },
    },
  ];

  Order.aggregate(pipeline, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      chartData: result,
    });
  });
};

exports.osTraffic = (req, res) => {
  const pipeline = [
    { $match: { os: { $exists: true, $ne: null } } },
    { $group: { _id: { $ifNull: ["$os", "Unknown"] }, count: { $sum: 1 } } },
  ];

  Order.aggregate(pipeline, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      chartData: result,
    });
  });
};

exports.countriesTraffic = (req, res) => {
  const pipeline = [
    { $match: { country: { $exists: true, $ne: null } } },
    { $group: { _id: "$country", count: { $sum: 1 } } },
    {
      $project: {
        _id: 0,
        country: "$_id",
        count: 1,
        country_code: "$address.country_code",
      },
    },
  ];

  Order.aggregate(pipeline, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    const totalCount = result.reduce((total, item) => total + item.count, 0);
    result.map(el => {
      el.percentage = Math.floor((el.count / totalCount) * 100);
    });

    res.json({
      result,
    });
  });
};
