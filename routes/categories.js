const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  fetchAllCategories,
  deleteMultiCategories,
  postMultipleCategories,
} = require("../controllers/categoryController");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");
const { userById } = require("../middlewares/user");

router.get("/", fetchAllCategories);
router.post(
  "/create/:userId",
  [requireSignIn, isAuth, isAdmin],
  createCategory
);
router.get("/:categoryId", getSingleCategory);
router.put("/:categoryId", [requireSignIn, isAuth, isAdmin], updateCategory);
router.delete("/:categoryId", [requireSignIn, isAuth, isAdmin], deleteCategory);
router.post("/delete/multiple",deleteMultiCategories);
router.post("/multiple/create",postMultipleCategories);

router.param("categoryId", getCategory);
router.param("userId", userById);

module.exports = router;
