const { useDebugValue } = require("react");
const pool = require("../db/pool");
const bcrypt = require("bcrypt");

const getAllUsers = async ({
  search,
  minId,
  maxId,
  sort,
  order,
  limit,
  offset,
  role,
  status,
  createdAfter,
  createdBefore,
}) => {
  const allowedSortColumns = {
    id: "id",
    name: "name",
    email: "email",
    created_at: "created_at",
  };
  const allowedOrder = {
    asc: "ASC",
    desc: "DESC",
  };

  const allowedStatus = {
    active: "TRUE",
    inactive: "FALSE",
  };

  const sortOrder = allowedOrder[order] || "ASC";

  const sortColumn = allowedSortColumns[sort] || "id";

  const conditions = [];
  const values = [];
  let query = `
    SELECT id,name,email,phone,created_at
    FROM users
    `;

  if (search) {
    conditions.push(
      `(name ILIKE $${values.length + 1} OR email ILIKE $${values.length + 1} )`,
    );
    values.push(`%${search}%`);
  }
  if (minId !== undefined) {
    conditions.push(`id >= $${values.length + 1}`);
    values.push(minId);
  }
  if (maxId !== undefined) {
    conditions.push(`id <= $${values.length + 1}`);
    values.push(maxId);
  }

  if (role !== undefined && role.length > 0) {
    const placeholders = role.map(
      (_, index) => `$${values.length + index + 1}`,
    );

    // 2. Wrap placeholders in parentheses for valid SQL syntax
    conditions.push(`role IN (${placeholders.join(",")})`);

    values.push(...role);
  }

  if (status !== undefined) {
    const statusFilter = allowedStatus[status];
    conditions.push(`status = $${values.length + 1}`);
    values.push(statusFilter);
  }
  if (createdBefore !== undefined) {
    conditions.push(`created_at <= $${values.length + 1}`);
    values.push(createdBefore);
  }

  if (createdAfter !== undefined) {
    conditions.push(`created_at >= $${values.length + 1}`);
    values.push(createdAfter);
  }

  //cursor pagination

  if (conditions.length > 0) {
    query += `WHERE ${conditions.join(" AND ")}`;
  }

  query += `
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
    `;
  const countValues = [...values];
  values.push(limit, offset);

  let countQuery = `
    SELECT COUNT(*)
    FROM users
    `;
  if (conditions.length > 0) {
    countQuery += `WHERE ${conditions.join(" AND ")}`;
  }

  const result = await pool.query(query, values);

  const countResult = await pool.query(countQuery, countValues);

  return {
    users: result.rows,
    total: Number(countResult.rows[0].count),
  };
};

const getUsersCursor = async ({ afterId, limit }) => {
  let query = `
    SELECT id, name, email, phone, created_at
    FROM users
  `;

  const values = [];

  if (afterId !== undefined) {
    query += ` WHERE id > $1`;
    values.push(afterId);
  }

  /*
   * Ask for one extra row.
   *
   * If the client asks for 20,
   * we actually request 21.
   *
   * The 21st row tells us whether
   * another page exists.
   */
  query += `
    ORDER BY id ASC
    LIMIT $${values.length + 1}
  `;

  values.push(limit + 1);

  const result = await pool.query(query, values);

  const hasNextPage = result.rows.length > limit;

  // Only return the number of records requested by the client.
  const users = result.rows.slice(0, limit);

  let nextCursor = null;

  if (hasNextPage && users.length > 0) {
    nextCursor = users[users.length - 1].id;
  }

  return {
    users,
    hasNextPage,
    nextCursor,
  };
};

const getUsersCreatedCursor = async ({ afterId, limit, afterCreated_at }) => {
  const values = [];
  let query = `SELECT id,name,email,phone,created_at
              FROM users`;
  if (afterCreated_at !== undefined) {
    query += `WHERE (created_at,id) > ($${values.length + 1},$${values.length + 2})
               ORDER BY created_at ASC, id ASC
               LIMIT $${values.length + 3} 
              `;
    values.push(afterCreated_at, afterId, limit + 1);
  }
  const results = await pool.query(query, values);
  const hasNextPage = results.rows.length > limit;
  const users = results.rows.slice(0, limit);
  let nextCursor = null;
  if (hasNextPage && users.length > 0) {
    const id = users[users.length - 1].id;
    const createdAt = users.find((user) => user.id === id)?.created_at;
    nextCursor = {
      createdAt,
      id,
    };
  }
  return {
    users,
    hasNextPage,
    nextCursor,
  };
};

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id,name,email
        FROM users
        WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

const createUser = async (name, email, password, phone) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name,email,password_hash,phone)
      VALUES ($1,$2,$3,$4)
      RETURNING id,name,email,phone,created_at`,
    [name, email, passwordHash, phone],
  );
  return result.rows[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getUsersCursor,
  getUsersCreatedCursor,
};
