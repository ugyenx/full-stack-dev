const userService = require("../services/userService");

const getUsers = async (req, res, next) => {
  try {
    const {
      search,
      minId,
      maxId,
      sort,
      order,
      page,
      limit,
      role,
      status,
      createdAfter,
      createdBefore,
    } = req.query;

    const result = await userService.getAllUsers({
      search,
      minId,
      maxId,
      sort,
      order,
      page,
      limit,
      role,
      status,
      createdAfter,
      createdBefore,
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

const getUsersCursor = async (req, res, next) => {
  try {
    const { afterId, limit } = req.query;

    const result = await userService.getUsersCursor({
      afterId,
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

const getUsersCreatedCursor = async (req, res, next) => {
  try {
    const { limit, afterId, afterCreatedAt } = req.query;
    const results = await userService.getUsersCreatedCursor({
      limit,
      afterCreatedAt,
      afterId,
    });

    res.status(200).json({
      success: true,
      data: results.users,
      pagination: results.pagination,
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
  getUsersCursor,
  getUserById,
  createUser,
  getUsersCreatedCursor,
};
