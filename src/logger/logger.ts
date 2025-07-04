import winston from "winston";
import config from "../config/config";

interface LoggingInfo {
  level: string;
  message: string;
}

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.nodeEnv === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.nodeEnv === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf((info) => `${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;
