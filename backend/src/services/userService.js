const userRepository = require("../repositories/userRepository");
const AppError = require("../errors/AppError");

const getAllUsers = async ({
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
}) => {
  const offset = (page - 1) * limit;
  const result = await userRepository.getAllUsers({
    search,
    minId,
    maxId,
    sort,
    order,
    limit,
    offset,
    role,
    createdAfter,
    createdBefore,
    status,
  });
  const totalPages = Math.ceil(result.total / limit);
  return {
    users: result.users,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages,
    },
  };
};
const getUsersCursor = async ({ afterId, limit }) => {
  const result = await userRepository.getUsersCursor({
    afterId,
    limit,
  });

  return {
    users: result.users,
    pagination: {
      limit,
      hasNextPage: result.hasNextPage,
      nextCursor: result.nextCursor,
    },
  };
};

const getUsersCreatedCursor = async ({ afterId, limit, afterCreatedAt }) => {
  const results = await userRepository.getUsersCreatedCursor({
    afterId,
    limit,
    afterCreatedAt,
  });

  return {
    users: results.users,
    pagination: {
      limit,
      hasNextPage: results.hasNextPage,
      nextCursor: results.nextCursor,
    },
  };
};
const getUserById = async ({ authenticatedUserId, requestedUserId }) => {
  const authenticatedUser =
    await userRepository.getUserById(authenticatedUserId);

  if (!authenticatedUser) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const isOwner = authenticatedUserId === requestedUserId;
  const isAdmin = authenticatedUser.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new AppError("Unauthorized", 403, "FORBIDDEN");
  }

  return await userRepository.getUserById(requestedUserId);
};

const createUser = async (name, email, password, phone) => {
  try {
    return await userRepository.createUser(name, email, password, phone);
  } catch (error) {
    if (error.code === "23505") {
      throw new AppError(
        "Email already registered",
        409,
        "EMAIL_ALREADY_REGISTERED",
      );
    }
    throw error;
  }
};

const deleteUser = async (id) => {
  const response = await userRepository.deleteUser(id);
  if (!response) {
    throw new AppError("User doesn't  exists", 404, "USER_NOT_FOUND");
  }
  return response;
};

module.exports = {
  getAllUsers,
  getUsersCursor,
  getUserById,
  createUser,
  deleteUser,
  getUsersCreatedCursor,
};
