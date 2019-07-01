const express = require("express");
const router = express.Router();
const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;


passport.use(
  new Strategy(
    {
      clientID: "456193648552503",
      clientSecret: "c2f918dd33d892286460004412842c90",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);


router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/fb/profile",
    failureRedirect: "/user/login"
  })
);
router.get("/fb/profile", (req, res) => {
  res.send(req.user);
});

module.exports = router;
