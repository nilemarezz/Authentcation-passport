const express = require("express");
const router = express.Router();
const passport = require("passport");
const Strategy = require('passport-facebook').Strategy;


    passport.use(new Strategy({
        clientID: '456193648552503',
        clientSecret: 'c2f918dd33d892286460004412842c90',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook"));



module.exports = router;
