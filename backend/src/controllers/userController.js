const userService = require("../services/userService");

const getUsers = async (req, res, next) => {
  try {
    const { search, minId, maxId, sort, order, page, limit } = req.query;

    const result = await userService.getAllUsers({
      search,
      minId,
      maxId,
      sort,
      order,
      page,
      limit,
    });
    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination,
      message: "Users fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    res.json({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const user = await userService.createUser(name, email, password, phone);

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
