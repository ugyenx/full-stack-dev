const config = require("../config/env");
const AppError = require("../errors/AppError");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new AppError("Authentication Required", 401, "UNAUTHORIZED"));
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return next(
        new AppError("Invalid or expired token", 401, "INVALID_TOKEN"),
      );
    }

    next(error);
  }
};

module.exports = { authenticate };
