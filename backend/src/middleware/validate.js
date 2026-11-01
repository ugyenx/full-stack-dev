const AppError = require("../errors/AppError");

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: errors,
        },
      });
    }

    req.validatedBody = result.data;
    next();
  };
};

module.exports = validate;
