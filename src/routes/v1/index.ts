import { Express } from "express";
import auth from "./auth";

export const v1Apis = function (app: Express) {
  app.use("/api/v1/auth", auth);
};
// localhost:6700/api/v1/auth/google