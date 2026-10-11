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
};
