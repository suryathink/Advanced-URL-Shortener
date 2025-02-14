import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

// Rate limiter for login/signup routes
const authLimiter = new RateLimiterMemory({
  points: 15, // Limit each IP to 10 requests
  duration: 60, // Per 1 minute
});

// Rate limiter for general API traffic
const apiLimiter = new RateLimiterMemory({
  points: 1000, // Limit each IP to 1000 requests
  duration: 15 * 60, // Per 15 minutes
});

// Global rate limiter (fallback)
const globalLimiter = new RateLimiterMemory({
  points: 500, // Limit each IP to 500 requests
  duration: 15 * 60, // Per 15 minutes
});

// Middleware to apply the rate limiters
export const authLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (typeof req.ip !== "string") {
    res.status(400).send({ message: "Invalid IP address" });
    return;
  }

  try {
    await authLimiter.consume(req.ip); // Consume a point for this request
    next();
  } catch (rejRes) {
    res.status(429).send({
      message:
        "Too many requests from this IP, please try again after a minute.",
    });
  }
};

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
    await apiLimiter.consume(req.ip); // Consume a point for this request
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
    await globalLimiter.consume(req.ip); // Consume a point for this request
    next(); // Allow the request to proceed
  } catch (rejRes) {
    // Respond with a rate limit error if the rate limit is exceeded
    res.status(429).json({
      message:
        "Too many requests from this IP, please try again after 15 minutes.",
    });
  }
};
