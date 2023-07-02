const express = require("express");
const {
  fetchGeneraleSettings,
  saveGeneraleSettings,
  updateGeneraleSettings,
} = require("../controllers/generaleSettingController");
const { getGeneraleSettings } = require("../middlewares/generaleSetting");
const { isAuth, isAdmin, requireSignIn } = require("../middlewares/auth");
const router = express.Router();

router.get("/general", fetchGeneraleSettings);
router.post("/general", [requireSignIn, isAuth, isAdmin], saveGeneraleSettings);
router.put(
  "/general/:settingsId",
  [requireSignIn, isAuth, isAdmin],
  updateGeneraleSettings
);

router.param("settingsId", getGeneraleSettings);

module.exports = router;
