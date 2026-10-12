const pool = require("../db/pool");

const getUserByEmailForLogin = async (email) => {
  const user = await pool.query(
    `SELECT id,name,email,password_hash
        FROM users
        WHERE email = $1`,
    [email],
  );
  return user.rows[0];
};

const getUser = async (userId) => {
  const user = await pool.query(
    `SELECT id,name,email,phone,role,created_at
    FROM users
    WHERE id = $1`,
    [userId],
  );
  return user.rows[0];
};

module.exports = {
  getUserByEmailForLogin,
  getUser,
};
