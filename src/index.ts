import express from "express";
import { Error } from "mongoose";
import log4js, { Configuration } from "log4js";
import cors from "cors";
import * as dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import connectDatabase from "./configs/db";
import log4jsConfig from "./configs/log4js.config";
import { logRequests } from "./middlewares/requestLogger";
import { globalLimiterMiddleware } from "./middlewares/authLimiter";
import { routes } from "./routes/index";
import "./configs/passport"; 

log4js.configure(log4jsConfig as Configuration);

const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set `true` in production with HTTPS
      httpOnly: true, // Prevent client-side access
      sameSite: "lax", // Adjust if cross-origin requests fail
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(logRequests);


app.use(globalLimiterMiddleware);

routes(app);

const logger = log4js.getLogger();

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server listening on ${process.env.BASE_URL}`);
    });
  })
  .catch((error:Error) => {
    logger.error("Error connecting to the database", error);
    process.exit(1); 
  });
