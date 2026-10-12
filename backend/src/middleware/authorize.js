const authRepository = require("../repositories/authRepository");
const AppError = require("../errors/AppError");
const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await authRepository.getUser(req.user.userId);
      if (!user) {
        return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
      }
      if (!allowedRoles.includes(user.role)) {
        return next(
          new AppError(
            "You donot have permission to perform this action",
            403,
            "FORBIDDEN",
          ),
        );
      }
      req.user.role = user.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authorize,
};
