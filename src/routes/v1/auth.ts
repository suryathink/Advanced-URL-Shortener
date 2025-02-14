import express from "express";
import passport from "passport";
// import "../config/passportConfig"; // Ensure Passport is initialized
import "../../configs/passport"

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.send("Google Authentication Successful!");
  }
);

export default router;
