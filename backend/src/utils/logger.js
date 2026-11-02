const config = require("../config/env");
const winston = require("winston");

const isProduction = config.NODE_ENV === "production";

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),

  transports: [
    new winston.transports.Console({
      format: isProduction
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          )
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              return `${timestamp} ${level}: ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta) : ""
              }`;
            }),
          ),
    }),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

module.exports = logger;
