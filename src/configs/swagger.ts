import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";
import * as dotenv from "dotenv";
import log4js from "log4js";

dotenv.config();

const fileExtension = process.env.NODE_ENV === "development" ? "ts" : "js";
const logger = log4js.getLogger();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Advanced URL Shortener API",
      version: "1.0.0",
      description: "API documentation for the Advanced URL Shortener",
      contact: {
        name: "Surya",
        email: "spssuryasurya@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:6700",
        description: "Local server",
      },
     
    ],
  },
  apis: [
    path.join(__dirname, `../routes/v1/*.${fileExtension}`),
    path.join(__dirname, `../routes/*.${fileExtension}`),
  ],
};


const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info(
    `📜 Swagger docs available at: ${
      process.env.NODE_ENV === "production"
        ? "https://us.suryathink.com/api-docs"
        : "http://localhost:6700/api-docs"
    }`
  );
};
