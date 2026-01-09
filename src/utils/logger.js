const fs = require("fs");
const path = require("path");

const LOG_DIR = "logs";

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

function logError(message, meta = {}) {
  const logEntry = {
    time: new Date().toISOString(),
    message,
    meta,
  };

  fs.appendFileSync(
    path.join(LOG_DIR, "errors.log"),
    JSON.stringify(logEntry) + "\n"
  );
}

module.exports = { logError };
