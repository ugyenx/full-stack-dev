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
const logger = require("./src/utils/logger");
const app = express();
const pool = require("./src/db/pool");
const {
  router: healthRoutes,
  setShuttingDown,
} = require("./src/routes/healthRoutes");
const uploadErrorHandler = require("./src/middleware/uploadErrorMiddleware");
const uploadRoutes = require("./src/routes/uploadRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const path = require("path");

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// First Router

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/health", healthRoutes);
app.use("/api/uploads", uploadRoutes);
app.use(uploadErrorHandler);
app.use(errorHandler);

const server = app.listen(config.PORT, config.HOST, () => {
  logger.info("Server started", {
    port: config.PORT,
    host: config.HOST,
  });
});

let isShuttingDown = false;

const shutdown = (signal) => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  setShuttingDown();
  logger.info("Graceful shutdown initiated", {
    signal,
  });

  const forceShutdownTimer = setTimeout(() => {
    logger.error("Graceful shutdown timed out");

    server.closeAllConnections();

    process.exit(1);
  }, 10000);

  forceShutdownTimer.unref();

  server.close(async (error) => {
    if (error) {
      logger.error("HTTP server shutdown failed", {
        error: error.message,
      });

      clearTimeout(forceShutdownTimer);
      process.exit(1);
    }

    try {
      logger.info("HTTP server closed");
      await pool.end();

      logger.info("PostgreSQL connection pool closed");
      clearTimeout(forceShutdownTimer);
      logger.info("Application shutdown complete");
      process.exit(0);
    } catch (error) {
      logger.error("Error during the application shutdown", {
        error: error.message,
      });

      clearTimeout(forceShutdownTimer);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", {
    message: error.message,
    stack: error.stack,
  });

  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", {
    reason: reason instanceof Error ? reason.message : String(reason),
  });

  shutdown("unhandledRejection");
});
