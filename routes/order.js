const express = require('express');
const { createOrder } = require('../controllers/orderController');
const { requireSignIn, isAuth } = require('../middlewares/auth');
const { updateProductStock } = require('../middlewares/product');
const router = express.Router();
const { userById } = require("../middlewares/user");

router.post('/create/:userId',[requireSignIn, isAuth, updateProductStock] ,createOrder);
router.param("userId", userById);

module.exports = router