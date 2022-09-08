const express = require("express");
const router = express.Router();
const { salam, signup, signin, signout } = require("../controllers/authControllers");
const { requireSignIn } = require("../middlewares/auth");
const {signUpValidaor} = require('../middlewares/userValidator')

router.get("/", salam);
router.post('/signup',signUpValidaor,signup)
router.post('/signin',signin)
router.get('/signout',signout)

router.get('/hello',requireSignIn, (req,res) => {
    res.send('welcom you are authorized')
})

module.exports = router;
