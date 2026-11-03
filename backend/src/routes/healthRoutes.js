const express = require("express");
const pool = require("../db/pool");
const router = express.Router();
const logger = require("../utils/logger");

let isShuttingDown = false;
const setShuttingDown = () => {
  isShuttingDown = true;
};

router.get("/live", (req, res) => {
  res.status(200).json({
    status: "alive",
  });
});

router.get("/ready", async (req, res) => {
  if (isShuttingDown) {
    return res.status(503).json({
      status: "not_ready",
      reason: "Application is shutting down",
    });
  }

  try {
    await pool.query("SELECT 1");
    return res.status(200).json({
      status: "ready",
      database: "connected",
    });
  } catch (error) {
    logger.error("Readiness check failed", {
      message: error.message,
    });
    return res.status(503).json({
      status: "not_ready",
      database: "disconnected",
    });
  }
});

module.exports = {
  router,
  setShuttingDown,
};
