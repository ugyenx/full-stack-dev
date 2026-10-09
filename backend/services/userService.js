const userRepository = require("../repositories/userRepository");
const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};

const getUserById = (id) => {
  return userRepository.getUserById(id);
};

const createUser = (name) => {
  return userRepository.createUser(name);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
