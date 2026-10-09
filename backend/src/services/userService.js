const userRepository = require("../repositories/userRepository");
const AppError = require("../errors/AppError");

const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};

const getUserById = async (id) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const createUser = async (name, email, phone) => {
  return await userRepository.createUser(name, email, phone);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
