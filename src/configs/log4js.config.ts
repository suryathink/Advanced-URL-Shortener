import { Configuration } from "log4js";
import * as dotenv from "dotenv";
dotenv.config();
const DEFAULT_ERROR_LOG_LEVEL = process.env.DEFAULT_ERROR_LOG_LEVEL || "debug";
const API_ERROR_LOG_LEVEL = process.env.API_ERROR_LOG_LEVEL || "debug";
const SOCKET_ERROR_LOG_LEVEL = process.env.SOCKET_ERROR_LOG_LEVEL || "debug";

const log4jsConfig: Configuration = {
  appenders: {
    console: { type: "console" },
    file: {
      type: "file",
      filename: "logs/app.log",
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
    },
  },
  categories: {
    default: { appenders: ["console", "file"], level: DEFAULT_ERROR_LOG_LEVEL },
    api: { appenders: ["console", "file"], level: API_ERROR_LOG_LEVEL },
    socket: { appenders: ["console", "file"], level: SOCKET_ERROR_LOG_LEVEL },
  },
};

export default log4jsConfig;
