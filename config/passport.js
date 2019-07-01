const LocalStragy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStragy({ usernameField: 'email' },
            async (email, password, done) => {
                try {
                    // Match user
                    const user = await User.findOne({ email: email })
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered' })
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) return done(null, false, { message: 'Password is incorrect' })
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password is incorrect' })
                        }
                    });
                } catch (err) {
                    console.log(err)
                }

            })
    )

    passport.serializeUser((user, done) =>{
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=> {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}