const config = require("./src/config/env");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoute");
const { apiLimiter } = require("./src/middleware/rateLimitMiddleware");
const requestLogger = require("./src/middleware/requestLogger");
const errorHandler = require("./src/middleware/errorHandler");
const app = express();
app.use(helmet());
app.use(requestLogger);

// app.set("query parser", "extended");
const corsOptions = {
  origin: config.CLIENT_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "X-CSRF-Token"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(apiLimiter);

// First Router
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
