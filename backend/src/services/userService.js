const userRepository = require("../repositories/userRepository");
const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};

const getUserById = async (id) => {
  return await userRepository.getUserById(id);
};

const createUser = async (name, email, phone) => {
  return await userRepository.createUser(name, email, phone);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
