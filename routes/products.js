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
  searchProduct,
  scheduleProduct,
  duplicateProduct,
  deleteMultipleProducts,
  searchProductByName,
  bestSellingProducts,
  mostUsedCategories,
  getProductsByFilter,
} = require("../controllers/productController");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");
const { productValidator } = require("../middlewares/productValidator");
const { userById } = require("../middlewares/user");

router.get("/", fetchAllProduct);
router.get("/best-selling-products", bestSellingProducts);
router.get("/most-used-categories", mostUsedCategories);
router.get("/related/:productId", relatedProduct);
router.get("/search", searchProduct);
router.get("/productsList", searchProductByName);
router.post("/create/:userId", [requireSignIn, isAuth, isAdmin], createProduct);
router.post(
  "/duplicate/:userId",
  [requireSignIn, isAuth, isAdmin],
  duplicateProduct
);
router.post("/schedule", scheduleProduct);
router.post("/products/all", getProductsByFilter);
router.get("/:productId", showSingleProduct);
router.delete(
  "/:productId/:userId",
  [requireSignIn, isAuth, isAdmin],
  removeProduct
);
router.post(
  "/deleteMany/:userId",
  [requireSignIn, isAuth, isAdmin],
  deleteMultipleProducts
);
router.put("/:productId", updateProduct);

router.param("productId", getSingleProduct);
router.param("userId", userById);

module.exports = router;
