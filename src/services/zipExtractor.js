const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

/**
 * Extracts a zip file to a destination folder
 * @param {string} zipPath - path to zip file
 * @param {string} extractPath - destination folder
 */
const extractZip = (zipPath, extractPath) => {
  return new Promise((resolve, reject) => {
    // Ensure extraction folder exists
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
    }

    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on("close", () => {
        console.log("✅ ZIP extraction completed");
        resolve();
      })
      .on("error", (err) => {
        console.error("❌ ZIP extraction failed", err);
        reject(err);
      });
  });
};

module.exports = extractZip;
