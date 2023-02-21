const express = require("express");
const { uploadFile } = require("../controllers/fileStorageController");
const router = express.Router();

router.post("/upload", uploadFile);

module.exports = router;
