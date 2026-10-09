const userService = require("../services/userService");

const getUsers = async (req, res) => {
  const users = await userService.getAllUsers();

  res.json(users);
};

const getUserById = async (req, res) => {
  const id = Number(req.params.id);
  const user = await userService.getUserById(id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.json(user);
};

const createUser = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  const user = await userService.createUser(name, email, phone);

  res.status(201).json(user);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
