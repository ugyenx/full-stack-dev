const users = require("../data/users");
const pool = require("../db/pool");
const bycrypt = require("bcrypt");

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
  return result.rows;
};

const createUser = async (name, email, phone) => {
  const passwordHash = await bycrypt.hash(email, 10);

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
