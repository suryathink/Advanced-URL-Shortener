import { Express, Request, Response } from "express";
import { v1Apis } from "./v1";

export const routes = function (app: Express) {
  app.use("/health", (req: Request, res: Response) => {
    res.send("✅ Server is healthy! 🚀 It's up and running smoothly.");
    return;
  });
  v1Apis(app);
};
