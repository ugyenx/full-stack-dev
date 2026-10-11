const AppError = require("../errors/AppError");

const validateCreatedCursorQuery = (req, res, next) => {
  let { limit, afterId, afterCreatedAt } = req.query;
  if (limit !== undefined) {
    limit = Number(limit);
    if (!Number.isInteger(limit)) {
      return next(
        new AppError("Limit should be postive integer", 400, "INVALID_LIMIT"),
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

  if (afterId !== undefined) {
    afterId = Number(afterId);
    if (!Number.isInteger(afterId) || afterId < 1) {
      return next(
        new AppError(
          "afterId should be postive integer",
          400,
          "INVALID_AFTER_ID",
        ),
      );
    }
    req.query.afterId = afterId;
  }

  if (afterCreatedAt !== undefined) {
    const parsedDate = new Date(afterCreatedAt);
    if (parsedDate.toISOString() !== afterCreatedAt) {
      return next(
        new AppError("Invalid afterCreatedAt", 400, "INVALID_AFTERCREATEDAT"),
      );
    }
    req.query.afterCreatedAt = afterCreatedAt;
  }

  if (afterCreatedAt !== undefined && afterId === undefined) {
    return next(
      new AppError("Both the field are required", 400, "BOTH_REQUIRED"),
    );
  }

  if (afterCreatedAt === undefined && afterId !== undefined) {
    return next(
      new AppError("Both fields are required", 400, "BOTH_FIELD_REQUIRED"),
    );
  }

  next();
};

module.exports = {
  validateCreatedCursorQuery,
};
