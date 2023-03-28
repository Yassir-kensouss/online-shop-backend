const express = require("express");
const { generateToken, paymentProcess } = require("../controllers/braintreeController");
const { requireSignIn } = require("../middlewares/auth");
const router = express.Router();
const { userById } = require("../middlewares/user");

router.get('/getToken/:userId', generateToken);
router.post('/purchase/:userId', paymentProcess);
router.param("userId", userById);

module.exports = router