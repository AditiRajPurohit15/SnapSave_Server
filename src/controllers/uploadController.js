const path = require("path");
const extractZip = require("../services/zipExtractor");
const organizeMedia = require("../services/mediaOrganizer");

const uploadAndExtract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No ZIP file uploaded" });
    }

    const zipPath = req.file.path;
    const extractPath = path.join("extracted", path.parse(zipPath).name);

    await extractZip(zipPath, extractPath);
    organizeMedia(extractPath);

    res.json({
      message: "ZIP uploaded and extracted successfully",
      extractedTo: extractPath,
    });
  } catch (error) {
    res.status(500).json({
      message: "ZIP extraction failed",
      error: error.message,
    });
  }
};

module.exports = { uploadAndExtract };
