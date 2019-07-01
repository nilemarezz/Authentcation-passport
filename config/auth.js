module.exports = {
    eusureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Plaease login to view this source')
        res.redirect('/user/login');
    }
}