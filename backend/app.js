require("dotenv").config();

const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoute");
const app = express();

// app.set("query parser", "extended");

app.use(cors());
app.use(express.json());

// First Router
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Internal server error",
      code: err.code,
    },
  });
};

app.use(errorHandler);

module.exports = app;
