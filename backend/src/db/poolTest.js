const pool = require("./pool");
console.log(pool);
const testPool = async () => {
  console.log("Total:", pool.totalCount);
  console.log("Idle:", pool.idleCount);
  console.log("Waiting:", pool.waitingCount);
  await pool.query("SELECT 1");
  console.log("After query:");
  console.log("Total:", pool.totalCount);
  console.log("Idle:", pool.idleCount);
  console.log("Waiting:", pool.waitingCount);
  await pool.end();
};

testPool();
