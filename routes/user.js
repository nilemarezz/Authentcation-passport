const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');

// ------------- LOCAL ROUTE ------------------------
router.get('/signup',(req,res)=> res.render('signup',{errors:[]}));
router.post('/signup', async (req,res)=> {
    const {name, email, password, password2} = req.body;
    
    // Check error from register
    let errors = [];
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields'})
    }
    if(password != password2){
        errors.push({msg:'Password not Match'})
    }
    if(password.length <6){
        errors.push({msg:'Pasword must more than 6 letters'})
    }

    if(errors.length > 0){
        res.render('signup',{errors})
    }else{
        // Success
        // Check if email is valid or
        try{
            const user = await User.findOne({email:email})
            if(user){
                errors.push({msg:'Email is already exist'});
                res.render('signup',{errors})
            }else{
                //New User
                const newUser = {name:name,email:email,password:password};
                // Hash Password
                bcrypt.genSalt(10,(err,salt)=>
                    bcrypt.hash(newUser.password,salt,null,async (err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        // add to Database
                        await User.create(newUser);
                        req.flash('success_msg','You are now Register!!');
                        res.render('login',{errors});
                    })
                )
            }
        }catch(err){
            console.log(err)
        }

    }

});

router.get('/login',(req,res)=> res.render('login',{errors:[]}));
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/profile',
        failureRedirect : '/user/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged Out');
    res.redirect('/user/login');
})


//---------------------- FB ROUTE ---------------------

router.get("/auth/facebook", passport.authenticate("facebook",{ scope : ['email']}));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/user/fail",
    session: true
  })
);

router.get('/fail',(req,res)=>{
    res.send('fail')
})



module.exports = router;