const express = require('express');
const router = express.Router();
const { calculateRevenues } = require('../controllers/statisticsController');


router.get('/total/revenues', calculateRevenues);

module.exports = router