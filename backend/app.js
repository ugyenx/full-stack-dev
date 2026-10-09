const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// First Router
app.use("/api/users", userRoutes);

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
  });
};

app.use(errorHandler);

module.exports = app;
