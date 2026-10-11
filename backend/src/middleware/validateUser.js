const AppError = require("../errors/AppError");

const validateCreateUser = (req, res, next) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !phone || !password) {
    return next(
      new AppError(
        "Name, email and phone are required",
        400,
        "ALL_FIELDS_REQUIRED",
      ),
    );
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanName) {
    return next(new AppError("Name cannot be empty", 400, "NAME_EMPTY"));
  }
  if (!cleanEmail) {
    return next(new AppError("Email cannot be empty", 400, "EMAIL_EMPTY"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError("Invalid email address", 400, "INVALID_EMAIL"));
  }

  const passwordRegex = /^.{8,}$/;
  if (!passwordRegex.test(password)) {
    return next(
      new AppError(
        "Password should be minimum of 8 character",
        400,
        "PASSWORD_MINIMUM_8C",
      ),
    );
  }

  const phoneRegex = /^\d{8,15}$/;
  if (!phoneRegex.test(phone)) {
    return next(new AppError("Invalid phone number", 400, "INVALID_PHONE"));
  }

  req.body.name = cleanName;
  req.body.email = cleanEmail;

  next();
};

module.exports = {
  validateCreateUser,
};
