import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

const fileExtension = process.env.NODE_ENV === "production" ? "js" : "ts";

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
    path.resolve(__dirname, `../routes/v1/*.${fileExtension}`),
    path.resolve(__dirname, `../routes/*.${fileExtension}`),
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(
    `📜 Swagger docs available at: ${
      process.env.NODE_ENV === "production"
        ? "https://us.suryathink.com/api-docs"
        : "http://localhost:6700/api-docs"
    }`
  );
};
