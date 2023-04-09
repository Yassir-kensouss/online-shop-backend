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
} = require("../controllers/productController");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");
const { productValidator } = require("../middlewares/productValidator");
const { userById } = require("../middlewares/user");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    let ext = '';
    if(file.originalname.split('.').length >1 ){
    ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    }
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

router.get("/", fetchAllProduct);
router.post("/best-selling-products", bestSellingProducts)
router.get("/related/:productId", relatedProduct);
router.get("/search", searchProduct);
router.get("/productsList", searchProductByName)
router.post("/create/:userId", [requireSignIn, isAuth, isAdmin], createProduct);
router.post("/duplicate/:userId", [requireSignIn, isAuth, isAdmin], duplicateProduct);
router.post("/schedule", scheduleProduct);
router.get("/:productId", showSingleProduct);
router.delete(
  "/:productId/:userId",
  [requireSignIn, isAuth, isAdmin],
  removeProduct
);
router.post('/deleteMany/:userId', [requireSignIn, isAuth, isAdmin], deleteMultipleProducts)
router.put("/:productId", updateProduct);

router.param("productId", getSingleProduct);
router.param("userId", userById);

module.exports = router;
