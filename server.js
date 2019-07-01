require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');



// DB Config
const configDB = require('./config/database');
mongoose.connect(configDB.url,{ useNewUrlParser: true });
const db = mongoose.connection;
db.on('error',(error)=>console.log(error));
db.once('open',()=>console.log('Connect to database'));

// app config
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

// Express Session
app.use(session({secret:'secret',resave:true,saveUninitialized:true}));

// passport Middleware
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Route
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));
app.use('/',require('./routes/facebook-route'));


app.listen(process.env.PORT || 3000,()=>console.log('Server is Started'));