import { Request, Response, NextFunction } from "express";
import log4js from "log4js";

const logger = log4js.getLogger("api");

export function logRequests(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl, body, query, params } = req;

  const logMessage: any = {
    method,
    url: originalUrl,
    body,
    query,
    params,
  };

  const excludedRoutes = ["/login", "/signup"];
  if (excludedRoutes.includes(req.path)) {
    logMessage.body = "";
    logMessage.query = {};
    logMessage.params = {};
  }

  logger.info("Incoming request:", logMessage);
  next();
}
