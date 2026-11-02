const config = require("../config/env");

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});
module.exports = pool;
