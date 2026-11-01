const AppError = require("../errors/AppError");
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
      status,
      createdAfter,
      createdBefore,
    } = req.query;
    const role = req.normalizedRole;
    console.log("QUERY:", req.query);
    console.log("PAGE:", page, typeof page);
    console.log("LIMIT:", limit, typeof limit);

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
    const authenticatedUserId = Number(req.user.userId);
    const requestedUserId = Number(req.params.id);
    const user = await userService.getUserById({
      authenticatedUserId,
      requestedUserId,
    });
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
    const { name, email, password, phone } = req.validatedBody;

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
const deleteUser = async (req, res, next) => {
  try {
    const requestedUserId = Number(req.params.id);
    await userService.deleteUser(requestedUserId);
    res.status(200).json({
      success: true,
      message: "User successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const authenticatedUserId = Number(req.user.userId);
    const requestedUserId = Number(req.params.id);
    const updates = req.body;

    if (!Number.isInteger(requestedUserId) || requestedUserId <= 0) {
      throw new AppError("Invalid user id", 400, "INVALID_USER_ID");
    }

    if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
      throw new AppError("Request body must be an object", 400, "INVALID_BODY");
    }

    const updatedUser = await userService.updateUser({
      authenticatedUserId,
      requestedUserId,
      updates,
    });
    console.log(updatedUser);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
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
  deleteUser,
  updateUser,
};
