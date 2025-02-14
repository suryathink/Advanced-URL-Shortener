import express from "express";
import { Error } from "mongoose";
import log4js, { Configuration } from "log4js";
import cors from "cors";
import connectDatabase from "./configs/db";
import log4jsConfig from "./configs/log4js.config";
import { logRequests } from "./middlewares/requestLogger";
import { globalLimiterMiddleware } from "./middlewares/authLimiter";
import { routes } from "./routes/index";
log4js.configure(log4jsConfig as Configuration);
import * as dotenv from "dotenv";
import "./configs/passport"; 
import passport from "passport";
import session from "express-session";
const app = express();
dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT;

app.use(logRequests);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Apply rate limiter middleware
app.use(globalLimiterMiddleware);

// Use your router for the routes
routes(app);

// Set up the logger
const logger = log4js.getLogger();

// Connect to the database and start the server
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error:Error) => {
    logger.error("Error connecting to the database", error);
    process.exit(1); // Exit the process if the database connection fails
  });
