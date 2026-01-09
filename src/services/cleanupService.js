const fs = require("fs");
const path = require("path");

/**
 * Safely removes a file or folder
 */
function safeRemove(targetPath) {
  if (!targetPath) return;

  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    console.log("🧹 Removed:", targetPath);
  }
}

/**
 * Cleanup pipeline temporary files
 */
function cleanupPipeline({ zipPath, extractPath }) {
  try {
    safeRemove(zipPath);
    safeRemove(extractPath);
  } catch (err) {
    console.error("⚠️ Cleanup failed:", err.message);
  }
}

module.exports = cleanupPipeline;
