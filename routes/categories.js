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
  searchCategory,
  fetchCategories
} = require("../controllers/categoryController");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");
const { userById } = require("../middlewares/user");

router.get("/fetchAll", fetchAllCategories);
router.post(
  "/create/:userId",
  [requireSignIn, isAuth, isAdmin],
  createCategory
);
router.get("/:categoryId", getSingleCategory);
router.put("/:categoryId", [requireSignIn, isAuth, isAdmin], updateCategory);
router.delete("/:categoryId", [requireSignIn, isAuth, isAdmin], deleteCategory);
router.post("/delete/multiple",[requireSignIn, isAuth, isAdmin],deleteMultiCategories);
router.post("/multiple/create",postMultipleCategories);
router.get("/categories/search", searchCategory);
router.get("/categories/all", fetchCategories);

router.param("categoryId", getCategory);
router.param("userId", userById);

module.exports = router;
