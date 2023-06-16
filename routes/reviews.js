const express = require("express");
const {
  addProductReview,
  fetchReviews,
} = require("../controllers/reviewController");
const { isProductExist } = require("../middlewares/isProductExist");
const router = express.Router();

router.post("/add", addProductReview);
router.get("/fetch/:productId", fetchReviews);

router.param("productId", isProductExist);

module.exports = router;
