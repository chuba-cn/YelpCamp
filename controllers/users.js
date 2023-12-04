const User = require('../models/user');

module.exports.renderRegisterForm =  (req, res) => {
    res.render('usersAuth/register');
};

module.exports.register = async(req, res, next) =>{
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) {
                return next(err);
            }
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
        
    }catch(err){
        req.flash('error', err.message);
        res.redirect('/register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('usersAuth/login');
};

module.exports.login = async(req, res) =>{
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) =>{
    req.logout(function (err){
        if(err){
            return next(err);
        }
    });
    req.flash('success', 'You are logged out!');
    res.redirect('/campgrounds');
};