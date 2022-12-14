const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  signInWithGoogle,
  resetPassword,
  updatePassword,
} = require("../controllers/authControllers");
const { requireSignIn } = require("../middlewares/auth");
const { signUpValidaor } = require("../middlewares/userValidator");

router.post("/signup", signUpValidaor, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/v1/auth/google", signInWithGoogle);
router.post("/password-reset", resetPassword);
router.post("/password-reset/:userId/:token", updatePassword);

module.exports = router;
