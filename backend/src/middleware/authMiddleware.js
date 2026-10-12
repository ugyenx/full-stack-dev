const AppError = require("../errors/AppError");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(
        new AppError(
          "Authentication token is required",
          401,
          "AUTH_TOKEN_REQUIRED",
        ),
      );
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return next(
        new AppError("Invalid authrization header", 401, "INVALID_AUTH_HEADER"),
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401, "INVALID_TOKEN"));
  }
};

module.exports = { authenticate };
