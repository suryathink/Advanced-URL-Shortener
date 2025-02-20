import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user";
import log4js from "log4js";

const logger = log4js.getLogger();

dotenv.config();

logger.info("process.env.NODE_ENV", process.env.NODE_ENV);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL:
        process.env.NODE_ENV === "development"
          ? "/api/v1/auth/google/callback"
          : "https://us.suryathink.com/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0].value,
            name: profile.displayName,
            avatar: profile.photos?.[0].value,
          });
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  const { _id } = user as any;

  try {
    const user: any = await User.findById(_id);
    done(null, user as any);
  } catch (error) {
    done(error, null);
  }
});
