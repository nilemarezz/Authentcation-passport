const express = require('express');
const router = express.Router();
const {eusureAuthenticated} = require('../config/auth');

router.get('/',(req,res)=> res.render('index'));
router.get('/profile',eusureAuthenticated,(req,res)=>{
    res.render('profile',{name:req.user.name,email:req.user.email});
    
})

module.exports = router;