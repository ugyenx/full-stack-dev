const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");
const bycrypt = require("bcrypt");
const userRoutes = require("./routes/userRoutes");
const app = express();

const PORT = 3000;
app.use(cors());
app.use(express.json());

app.post("/api/v1/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check if email already exist
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHas = await bycrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone)
      VALUES ($1,$2,$3,$4)
      RETURNING id,name,email,phone,created_at`,
      [name, email, passwordHas, phone],
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// First Router
app.use("/api/users", userRoutes);

const testDatabase = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connection success", result.rows[0]);
  } catch (error) {
    console.error("Database connection failed", error);
  }
};
testDatabase();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
