const AppError = require("../errors/AppError");

const validateCursorQuery = (req, res, next) => {
  let { afterId, limit } = req.query;

  // Validate afterId
  if (afterId !== undefined) {
    afterId = Number(afterId);

    if (!Number.isInteger(afterId) || afterId < 1) {
      return next(
        new AppError(
          "afterId should be a positive integer",
          400,
          "INVALID_AFTER_ID",
        ),
      );
    }

    req.query.afterId = afterId;
  }

  // Validate limit
  if (limit !== undefined) {
    limit = Number(limit);

    if (!Number.isInteger(limit)) {
      return next(
        new AppError("Limit should be an integer", 400, "LIMIT_NOT_INTEGER"),
      );
    }

    if (limit < 1 || limit > 100) {
      return next(
        new AppError(
          "Limit should be between 1 and 100",
          400,
          "LIMIT_OUT_OF_RANGE",
        ),
      );
    }

    req.query.limit = limit;
  } else {
    req.query.limit = 10;
  }

  next();
};

module.exports = {
  validateCursorQuery,
};
