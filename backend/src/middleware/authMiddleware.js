const AppError = require("../errors/AppError");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(new AppError("Authentication Required", 401, "UNAUTHORIZED"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401, "INVALID_TOKEN"));
  }
};

module.exports = { authenticate };
