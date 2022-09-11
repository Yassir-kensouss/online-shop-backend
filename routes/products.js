const express = require("express");
const router = express.Router();
const {
  createProduct,
  getSingleProduct,
  showSingleProduct,
  removeProduct,
  updateProduct,
  fetchAllProduct,
  relatedProduct,
  searchProdcut,
  getProductPhoto
} = require("../controllers/productController");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");
const { productValidator } = require("../middlewares/productValidator");
const { userById } = require("../middlewares/user");

router.get("/", fetchAllProduct);
router.get("/related/:productId", relatedProduct);
router.get("/search", searchProdcut);
router.get("/photo/:productId", getProductPhoto);
router.post("/create/:userId", [requireSignIn, isAuth, isAdmin], createProduct);
router.get("/:productId", showSingleProduct);
router.delete(
  "/:productId/:userId",
  [requireSignIn, isAuth, isAdmin],
  removeProduct
);
router.put("/:productId", updateProduct);

router.param("productId", getSingleProduct);
router.param("userId", userById);

module.exports = router;
