const {Order}  = require("../models/order");
const User = require("../models/user")

exports.calculateRevenues = async (req, res) => {

    const currentDate = new Date();
    const periodTime = 24 * 60 * 60 * 1000;
    const fromDate = new Date(currentDate - periodTime);
    const last48hour = new Date(currentDate - periodTime * 2);

    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();
    const newOrdersCount = await Order.countDocuments({createdAt: {$gte: fromDate}});
    const newUsersCount = await User.countDocuments({createdAt: {$gte: fromDate}});
    const last48hourUsers = await User.countDocuments({createdAt: {$lte: fromDate, $gte: last48hour}});
    const last48hourOrders = await User.countDocuments({createdAt: {$lte: fromDate, $gte: last48hour}});

    Order.find().exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
  
      const totalRevenue = orders
        .filter(order => order.status === "Delivered")
        .reduce((acc, order) => acc + order.totalPrice, 0);

      const totalSales = orders
        .reduce((acc, order) => acc + order.totalPrice, 0);
  
      res.json({
        totalRevenue,
        totalSales,
        totalUsers: usersCount,
        totalOrders: ordersCount,
        newOrders: {
            value: newOrdersCount,
            rate: newOrdersCount > last48hourOrders ? 1 : 0
        },
        newUsers: {
            value: newUsersCount,
            rate: newUsersCount > last48hourUsers ? 1 : 0
        },
        
      });
    });
  };