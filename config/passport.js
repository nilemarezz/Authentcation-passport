require('dotenv').config();
const LocalStragy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/User');
const facebookStrategy = require('passport-facebook');

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

    passport.use(new facebookStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL,
        profileFields: ['id', 'email', 'displayName', 'photos']

    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile._json.email);
            console.log(profile._json.name);
            
            const existingUser = await User.findOne({name:profile._json.name})
            if(existingUser){
                console.log('existingUser')
                console.log(existingUser);
                done(null,existingUser);
            }else{
                const newUser = {
                    method: 'facebook',
                    name:profile._json.name,
                    email:profile._json.email,
                    password:'facebook'
                }
                console.log('newUser')
                console.log(newUser);
                await User.create(newUser);
                done(null,newUser);
            }
            // Save to DB
            
        } catch (err) {
            console.log(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    
}