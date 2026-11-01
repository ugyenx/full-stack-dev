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

//Updating user , role based privildge to update
const updateUser = async ({
  authenticatedUserId,
  requestedUserId,
  updates,
}) => {
  const authenticatedUser =
    await userRepository.getUserById(authenticatedUserId);
  if (!authenticatedUser) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const requestedUser = await userRepository.getUserById(requestedUserId);

  const isOwner = authenticatedUserId === requestedUserId;
  const isAdmin = authenticatedUser.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new AppError(
      "You are not allowed to perform this action",
      403,
      "FORBIDDEN",
    );
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError(
      "At least one field is required",
      400,
      "NO_FIELDS_TO_UPDATE",
    );
  }

  const allowedFields = isAdmin
    ? ["name", "phone", "role", "status"]
    : ["name", "phone"];

  const requestedFields = Object.keys(updates);
  const invalidFields = requestedFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    throw new AppError(
      `You cannot update this field: ${invalidFields.join(", ")}`,
      403,
      "FORBIDDEN",
    );
  }

  if (updates.role !== undefined) {
    if (!["admin", "user"].includes(updates.role)) {
      throw new AppError("Invalid role", 400, "INVALID_ROLE");
    }
  }

  if (updates.status !== undefined) {
    if (!["active", "inactive"].includes(updates.status)) {
      throw new AppError("Invalid status", 400, "INVALID_STATUS");
    }
  }

  const updatedUser = await userRepository.updateUser(requestedUserId, updates);

  if (!updatedUser) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return updatedUser;
};

module.exports = {
  getAllUsers,
  getUsersCursor,
  getUserById,
  createUser,
  deleteUser,
  getUsersCreatedCursor,
  updateUser,
};
