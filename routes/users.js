const express = require('express')
const { getOneUser } = require('../controllers/userController');
const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');
const { userById } = require('../middlewares/user');

const router = express.Router()

router.get('/profile/:userId', requireSignIn, isAuth, getOneUser);
router.param('userId', userById)

module.exports = router