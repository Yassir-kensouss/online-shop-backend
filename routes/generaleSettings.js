const express = require("express");
const {
  fetchGeneraleSettings,
  saveGeneraleSettings,
  updateGeneraleSettings
} = require("../controllers/generaleSettingController");
const { getGeneraleSettings } = require("../middlewares/generaleSetting");
const router = express.Router();

router.get("/general", fetchGeneraleSettings);
router.post("/general", saveGeneraleSettings);
router.put("/general/:settingsId", updateGeneraleSettings);

router.param("settingsId", getGeneraleSettings)

module.exports = router;
