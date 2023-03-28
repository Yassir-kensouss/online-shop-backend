const express = require('express');
const { createNewCart, deleteCart } = require('../controllers/cartController');
const { requireSignIn } = require("../middlewares/auth");
const router = express.Router();


router.post('/create',requireSignIn, createNewCart);
router.delete('/remove/:cartId',requireSignIn, deleteCart);

module.exports = router