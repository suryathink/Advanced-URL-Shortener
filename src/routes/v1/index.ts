import { Express } from "express";
import auth from "./auth";
import url from "./url"

export const v1Apis = function (app: Express) {
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/url", url);
};
// localhost:6700/api/v1/auth/google