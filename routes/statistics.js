const express = require("express");
const router = express.Router();
const {
  calculateRevenues,
  totalRevenueInterval,
  browserTraffic,
  deviceTraffic,
  osTraffic,
  countriesTraffic,
} = require("../controllers/statisticsController");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");

router.get(
  "/total/revenues",
  [requireSignIn, isAuth, isAdmin],
  calculateRevenues
);
router.get("/revenue/interval", totalRevenueInterval);
router.get("/traffic/browsers", browserTraffic);
router.get("/traffic/device", deviceTraffic);
router.get("/traffic/os", osTraffic);
router.get("/traffic/countries", countriesTraffic);

module.exports = router;
