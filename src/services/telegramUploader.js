const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { logError } = require("../utils/logger");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// small delay helper (for retries)
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Upload a single file to Telegram with retry logic
 */
async function uploadWithRetry(filePath, caption, maxRetries = 3) {
    console.log("DEBUG uploadWithRetry filePath =", filePath);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const form = new FormData();
      form.append("chat_id", CHAT_ID);
      form.append("document", fs.createReadStream(filePath));
      if (caption) form.append("caption", caption);

      await axios.post(`${TELEGRAM_API}/sendDocument`, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      console.log(`📤 Uploaded: ${filePath}`);
      return true;
    } catch (error) {
      logError("Telegram upload failed", {
        file: filePath,
        attempt,
        error: error.message,
      });

      if (attempt < maxRetries) {
        await sleep(1000 * attempt); // backoff
      } else {
        return false;
      }
    }
  }
}

/**
 * Upload all organized media to Telegram with progress tracking
 */
async function uploadOrganizedMedia(baseDir = "organized", progress = null) {
  const files = [];

  // recursively collect files
  function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  walk(baseDir);

  if (progress) {
    progress.total = files.length;
    progress.uploaded = 0;
    progress.failed = 0;
    progress.status = "uploading";
  }

  for (const filePath of files) {
    const relativePath = path.relative(baseDir, filePath);
    const caption = `📁 ${relativePath.replace(/\\/g, "/")}`;

    if (progress) progress.currentFile = relativePath;

    const success = await uploadWithRetry(filePath, caption);

    if (progress) {
      success ? progress.uploaded++ : progress.failed++;
    }
  }

  if (progress) {
    progress.currentFile = null;
    progress.status = "done";
  }

  console.log("✅ All media uploaded to Telegram");
}

module.exports = uploadOrganizedMedia;
