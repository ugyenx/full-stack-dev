require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoute");
const { apiLimiter } = require("./src/middleware/rateLimitMiddleware");
const app = express();
app.use(helmet());

// app.set("query parser", "extended");
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(apiLimiter);

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
