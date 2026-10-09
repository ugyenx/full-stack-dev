const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// First Router
app.use("/api/users", userRoutes);

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server erro",
  });
};

app.use(errorHandler);

module.exports = app;
