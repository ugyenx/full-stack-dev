const pool = require("../db/pool");

const testConnection = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        INSERT INTO users (name,email,password_hash)
        VALUES ($1,$2,$3)
        RETURNING id`,
      ["Transaction Test", "transaction@gmail.com", "test"],
    );
    const userId = result.rows[0].id;
    await client.query(
      `UPDATE users
        SET id = $1
        WHERE id = $2`,
      ["9999999999", userId],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
