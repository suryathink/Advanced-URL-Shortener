import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);
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
  console.log("Serializing User:", user);

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
