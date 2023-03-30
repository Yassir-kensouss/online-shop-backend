const express = require('express');
const { createOrder, fetchOrders, getStatus, changeOrderStatus } = require('../controllers/orderController');
const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');
const { orderById } = require('../middlewares/order');
const { updateProductStock } = require('../middlewares/product');
const router = express.Router();
const { userById } = require("../middlewares/user");

router.post('/create/:userId',[requireSignIn, isAuth, updateProductStock] ,createOrder);
router.get('/:userId', [requireSignIn, isAuth, isAdmin], fetchOrders);
router.get('/status/:userId',[requireSignIn, isAuth, isAdmin], getStatus);
router.patch('/:orderId/status/:userId',[requireSignIn, isAuth, isAdmin], changeOrderStatus);

router.param("orderId", orderById);
router.param("userId", userById);

module.exports = router