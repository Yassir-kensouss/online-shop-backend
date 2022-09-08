const express = require("express");
const router = express.Router();
const {
  createProduct,
  getSingleProduct,
  showSingleProduct,
  removeProduct,
  updateProduct,
  fetchAllProduct
} = require("../controllers/productController");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");
const { productValidator } = require("../middlewares/productValidator");
const { userById } = require("../middlewares/user");

router.get("/", fetchAllProduct);
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
