const express = require('express')
const { getOneUser, fetchAllUsers, deleteCustomer, updateCustomerStatus, deleteMultipleCustomers, searchCustomerByName, updateCustomerDetails } = require('../controllers/userController');
const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');
const { userById } = require('../middlewares/user');

const router = express.Router()

router.get('/profile/:userId', getOneUser);
// router.get('/profile/:userId', requireSignIn, isAuth, getOneUser);
router.get('/customers/all', fetchAllUsers)
router.delete('/customers/delete', deleteCustomer)
router.put('/customers/update/state', updateCustomerStatus)
router.put('/customers/update/details', updateCustomerDetails)
router.post('/customers/deleteMany', deleteMultipleCustomers)
router.get('/customers/customersList', searchCustomerByName)
router.param('userId', userById)

module.exports = router