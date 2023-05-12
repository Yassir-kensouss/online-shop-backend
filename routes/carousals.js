const express = require("express");
const {
  addHeroCarousalSlide,
  fetchHeroCarousals,
  deleteHeroCarousalSlide,
} = require("../controllers/carousalControllers");
const router = express.Router();

router.post("/hero/add", addHeroCarousalSlide);
router.get("/hero/fetch", fetchHeroCarousals);
router.delete("/hero/delete", deleteHeroCarousalSlide);

module.exports = router;
