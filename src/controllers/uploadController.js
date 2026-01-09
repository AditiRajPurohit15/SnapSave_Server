const path = require("path");
const extractZip = require("../services/zipExtractor");
const organizeMedia = require("../services/mediaOrganizer");
const uploadToTelegram = require("../services/telegramUploader");
const cleanupPipeline = require("../services/cleanupService");

const uploadAndExtract = async (req, res) => {
  // progress tracker (in-memory per request)
  const progress = {
    total: 0,
    uploaded: 0,
    failed: 0,
    currentFile: null,
    status: "starting",
  };

  let zipPath;
  let extractPath;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No ZIP file uploaded" });
    }

    zipPath = req.file.path;
    extractPath = path.join("extracted", path.parse(zipPath).name);

    // 1️⃣ Extract ZIP
    await extractZip(zipPath, extractPath);

    // 2️⃣ Organize extracted media
    organizeMedia(extractPath);

    // 3️⃣ Upload organized media to Telegram (with retry + progress)
    await uploadToTelegram("organized", progress);

    // 4️⃣ Cleanup temp files (ONLY after success)
    cleanupPipeline({ zipPath, extractPath });

    res.json({
      message:
        "Upload → Extract → Organize → Telegram upload → Cleanup completed",
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Pipeline failed (files preserved for retry)",
      progress,
      error: error.message,
    });
  }
};

module.exports = { uploadAndExtract };
