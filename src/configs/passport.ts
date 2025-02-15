import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user";
import { Request } from "express";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/v1/auth/google/callback"

    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("accessToken",accessToken)
      console.log("refreshToken",refreshToken)
      console.log("profile",profile)
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0].value,
            name: profile.displayName,
            avatar: profile.photos?.[0].value
          });
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       callbackURL: "/api/v1/auth/google/callback",
//       passReqToCallback: true, // Required for refreshToken
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       console.log("accessToken", accessToken);
//       console.log("refreshToken", refreshToken); // Should now be present
//       console.log("profile", profile);

//       try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           user = await User.create({
//             googleId: profile.id,
//             email: profile.emails?.[0].value,
//             name: profile.displayName,
//             avatar: profile.photos?.[0].value,
//           });
//         }

//         return done(null, user);
//       } catch (error) {
//         console.log(error);
//         return done(error, null);
//       }
//     }
//   )
// );

// Modify authorizationParams to request offline access
// passport.authenticate("google", {
//   scope: ["profile", "email"],
//   accessType: "offline", // ✅ Moved here
//   prompt: "consent", // ✅ Forces re-auth to get refreshToken
// });


passport.serializeUser((user, done) => {
  console.log("Serializing User:", user);

  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  console.log("Deserializing User ID:", user);

  try {
    // const user = await User.findById(id);
    done(null, user as any);
  } catch (error) {
    done(error, null);
  }});

