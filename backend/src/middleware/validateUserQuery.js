const AppError = require("../errors/AppError");

const validateUserQuery = (req, res, next) => {
  let { search, minId, maxId, sort, order, page, limit } = req.query;

  // search
  if (search !== undefined && typeof search !== "string") {
    return next(new AppError("Search must be a string", 400, "INVALID_SEARCH"));
  }

  // limit
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

  // page
  if (page !== undefined) {
    page = Number(page);

    if (!Number.isInteger(page)) {
      return next(
        new AppError("Page should be an integer", 400, "INVALID_PAGE_TYPE"),
      );
    }

    if (page < 1) {
      return next(
        new AppError("Page should be greater than 0", 400, "INVALID_PAGE"),
      );
    }

    req.query.page = page;
  } else {
    req.query.page = 1;
  }

  // minId
  if (minId !== undefined) {
    minId = Number(minId);

    if (!Number.isInteger(minId) || minId < 1) {
      return next(new AppError("Min ID is invalid", 400, "INVALID_MIN_ID"));
    }

    req.query.minId = minId;
  }

  // maxId
  if (maxId !== undefined) {
    maxId = Number(maxId);

    if (!Number.isInteger(maxId) || maxId < 1) {
      return next(new AppError("Max ID is invalid", 400, "INVALID_MAX_ID"));
    }

    req.query.maxId = maxId;
  }

  // sort
  const allowedSortColumns = ["id", "name", "email", "created_at"];

  if (sort !== undefined) {
    if (!allowedSortColumns.includes(sort)) {
      return next(
        new AppError(
          `Sort by ${sort} is not allowed`,
          400,
          "INVALID_SORT_COLUMN",
        ),
      );
    }
  }

  // order
  const allowedOrders = ["asc", "desc"];

  if (order !== undefined) {
    if (!allowedOrders.includes(order)) {
      return next(
        new AppError(`Order ${order} is not allowed`, 400, "INVALID_ORDER"),
      );
    }
  } else {
    req.query.order = "asc";
  }

  // Cross field validation
  if (minId !== undefined && maxId !== undefined) {
    if (minId > maxId) {
      return next(
        new AppError(
          "minId cannot be greater than maxid",
          400,
          "INVALID_ID_RANGE",
        ),
      );
    }
  }

  next();
};

module.exports = {
  validateUserQuery,
};
