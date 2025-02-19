import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import log4js from "log4js";
import path from "path";
const logger = log4js.getLogger("api");

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
      {
        url: "https://us.suryathink.com",
        description: "Production server",
      },
    ],
  },
  apis: [
    path.join(__dirname, "../routes/v1/*.ts"), 
    path.join(__dirname, "../routes/*.ts"),  
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info("📜 Swagger docs available at: https://us.suryathink.com/api-docs");
};
