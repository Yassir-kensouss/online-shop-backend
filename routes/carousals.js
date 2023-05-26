const express = require("express");
const {
  addHeroCarousalSlide,
  fetchHeroCarousals,
  deleteHeroCarousalSlide,
  editHeroCarousalSlide,
  addBrandLogo,
  fetchBrands,
  deleteBrands,
} = require("../controllers/carousalControllers");
const router = express.Router();

router.post("/hero/add", addHeroCarousalSlide);
router.get("/hero/fetch", fetchHeroCarousals);
router.delete("/hero/delete", deleteHeroCarousalSlide);
router.put("/hero/edit", editHeroCarousalSlide);

router.post("/brands/add", addBrandLogo);
router.get("/brands/fetch", fetchBrands);
router.delete("/brands/delete", deleteBrands);

module.exports = router;
