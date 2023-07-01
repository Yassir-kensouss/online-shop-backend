const express = require("express");
const router = express.Router();
const {
  createOrder,
  fetchOrders,
  getStatus,
  changeOrderStatus,
  searchOrder,
  ordersByFilters,
  calculateRevenues,
} = require("../controllers/orderController");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");
const { orderById } = require("../middlewares/order");
const { updateProductStock } = require("../middlewares/product");
const { userById } = require("../middlewares/user");

router.post(
  "/create/:userId",
  [requireSignIn, isAuth, updateProductStock],
  createOrder
);
router.get("/:userId", [requireSignIn, isAuth, isAdmin], fetchOrders);
router.get("/status/:userId", [requireSignIn, isAuth, isAdmin], getStatus);
router.patch(
  "/:orderId/status/:userId",
  [requireSignIn, isAuth, isAdmin],
  changeOrderStatus
);
router.get("/search/:userId", [requireSignIn, isAuth, isAdmin], searchOrder);
router.post(
  "/filters/:userId",
  [requireSignIn, isAuth, isAdmin],
  ordersByFilters
);

router.param("orderId", orderById);
router.param("userId", userById);

module.exports = router;
