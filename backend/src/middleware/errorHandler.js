const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    logger.error("Unexpected application error", {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      statusCode,
      errorName: err.name,
      errorMessage: err.message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: statusCode >= 500 ? "Internal server error" : err.message,
      code: err.code || "INTERNAL_SERVER_ERROR",
    },
  });
};

module.exports = errorHandler;
