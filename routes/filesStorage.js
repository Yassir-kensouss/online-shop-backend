const express = require("express");
const { uploadFile } = require("../controllers/fileStorageController");
const router = express.Router();
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

router.post("/upload", upload.array("file"), uploadFile);

module.exports = router;
