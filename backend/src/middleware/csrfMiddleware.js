const config = require("../config/env");

const crypto = require("crypto");

const AppError = require("../errors/AppError");

const safeCompare = (value1, value2) => {
  const buffer1 = Buffer.from(value1);
  const buffer2 = Buffer.from(value2);
  if (buffer1.length !== buffer2.length) {
    return false;
  }

  return crypto.timingSafeEqual(buffer1, buffer2);
};

const csrfProtection = (req, res, next) => {
  const csrfCookie = req.cookies?.csrfToken;
  const csrfHeader = req.get("X-CSRF-Token");
  const accessToken = req.cookies?.accessToken;

  if (!csrfCookie || !csrfHeader || !accessToken) {
    return next(new AppError("CSRF token missing", 403, "CSRF_TOKEN_MISSING"));
  }

  if (!safeCompare(csrfCookie, csrfHeader)) {
    return next(
      new AppError("CSRF token mismatch", 403, "CSRF_TOKEN_MISMATCH"),
    );
  }

  const parts = csrfCookie.split(".");

  if (
    parts.length !== 2 ||
    !/^[a-f0-9]{64}$/.test(parts[0]) ||
    !/^[a-f0-9]{64}$/.test(parts[1])
  ) {
    return next(new AppError("Invalid CSRF token", 403, "INVALID_CSRF_TOKEN"));
  }
  const [randomValue, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", config.CSRF_SECRET)
    .update(randomValue + accessToken)
    .digest("hex");
  if (!safeCompare(signature, expectedSignature)) {
    return next(
      new AppError(
        "Invalid CSRF token signature",
        403,
        "INVALID_CSRF_SIGNATURE",
      ),
    );
  }

  next();
};

module.exports = {
  csrfProtection,
};
