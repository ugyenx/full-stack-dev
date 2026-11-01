const { rateLimit } = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again later",
    },
  },
});

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "LOGIN_RATE_LIMIT_EXCEEDED",
      message: "Too many login attempts. Please try again after 15 minutes",
    },
  },
});

module.exports = {
  apiLimiter,
  loginLimiter,
};
