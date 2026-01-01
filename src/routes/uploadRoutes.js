const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { uploadAndExtract } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", upload.single("zip"), uploadAndExtract);

module.exports = router;
