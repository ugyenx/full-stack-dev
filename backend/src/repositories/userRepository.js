const pool = require("../db/pool");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT *
        FROM users
        WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

const createUser = async (name, email, phone) => {
  const passwordHash = await bcrypt.hash(email, 10);

  const result = await pool.query(
    `INSERT INTO users(name,email,password_hash,phone)
      VALUES ($1,$2,$3,$4)
      RETURNING id,name,email,phone,created_at`,
    [name, email, passwordHash, phone],
  );
  return result.rows;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
