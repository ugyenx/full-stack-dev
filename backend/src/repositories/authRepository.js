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

module.exports = {
  getUserByEmailForLogin,
};
