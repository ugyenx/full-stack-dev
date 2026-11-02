const { randomUUID } = require("crypto");
const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const requestId = randomUUID();

  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();

    const duration = Number(endTime - startTime) / 1_000_000;

    const metadata = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Number(duration.toFixed(2)),
    };

    let level = "info";

    if (res.statusCode >= 500) {
      level = "error";
    } else if (res.statusCode >= 400) {
      level = "warn";
    }

    logger.log({
      level,
      message: "HTTP request completed",
      ...metadata,
    });
  });

  next();
};

module.exports = requestLogger;
