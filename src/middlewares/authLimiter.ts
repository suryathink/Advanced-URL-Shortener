import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

const apiLimiter = new RateLimiterMemory({
  points: 1000,
  duration: 15 * 60,
});

const globalLimiter = new RateLimiterMemory({
  points: 500,
  duration: 15 * 60,
});
// Limit each IP to 50 requests for short URL operations , Per 1 minute for shortURL
const shortUrlLimiter = new RateLimiterMemory({
  points: 50,
  duration: 60,
});

export const apiLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (typeof req.ip !== "string") {
    res.status(400).send({ message: "Invalid IP address" });
    return;
  }

  try {
    await apiLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).send({
      message:
        "Too many requests from this IP, please try again after 15 minutes.",
    });
  }
};

// Global rate limiter middleware
export const globalLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (typeof req.ip !== "string") {
      res.status(400).send({ message: "Invalid IP address" });
      return;
    }
    await globalLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      message:
        "Too many requests from this IP, please try again after 15 minutes.",
    });
  }
};

// Middleware for Short URL APIs
export const shortUrlLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (typeof req.ip !== "string") {
    res.status(400).send({ message: "Invalid IP address" });
    return;
  }

  try {
    await shortUrlLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      message:
        "Too many requests for short URL operations from this IP, please try again later.",
    });
  }
};
