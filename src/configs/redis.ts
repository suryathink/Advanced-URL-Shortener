import Redis from "ioredis";
import log4js from "log4js";

const logger = log4js.getLogger("api");

const redisUrl = process.env.REDIS_URL!
const redis = new Redis(redisUrl);

redis.on("connect", () => {
  logger.info("Redis connected successfully!");
});

redis.on("error", (error) => {
  logger.error("Redis connection error:", error);
});

export default redis;
