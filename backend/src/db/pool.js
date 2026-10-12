const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  database: "foodora_db",
});
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});
module.exports = pool;
