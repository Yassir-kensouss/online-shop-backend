const express = require("express");
const { addHeroCarousalSlide } = require("../controllers/carousalControllers");
const router = express.Router();

router.post("/hero/add", addHeroCarousalSlide);

module.exports = router;
