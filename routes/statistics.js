const express = require('express');
const router = express.Router();
const { calculateRevenues, totalRevenueInterval, browserTraffic } = require('../controllers/statisticsController');


router.get('/total/revenues', calculateRevenues);
router.get('/revenue/interval', totalRevenueInterval);
router.get('/traffic/browsers', browserTraffic);

module.exports = router