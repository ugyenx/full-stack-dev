const authRepository = require("../repositories/authRepository");
const bcrypt = require("bcrypt");
const AppError = require("../errors/AppError");
const { generateAccessToken } = require("../utils/jwt");
const login = async ({ email, password }) => {
  const user = await authRepository.getUserByEmailForLogin(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }
  const accessToken = generateAccessToken(user);
  return {
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
  };
};

module.exports = { login };
