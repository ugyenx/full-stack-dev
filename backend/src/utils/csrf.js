const config = require("../config/env");
const crypto = require("crypto");

const generateCsrfToken = (accessToken) => {
  const randomValue = crypto.randomBytes(32).toString("hex");
  const signature = crypto
    .createHmac("sha256", config.CSRF_SECRET)
    .update(randomValue + accessToken)
    .digest("hex");
  return `${randomValue}.${signature}`;
};
module.exports = {
  generateCsrfToken,
};
