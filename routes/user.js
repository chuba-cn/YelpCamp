const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');

router.get('/register', (req, res) => {
    res.render('usersAuth/register');
});

router.post('/register', catchAsync(async(req, res, next) =>{
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
}));

router.get('/login', (req, res) => {
    res.render('usersAuth/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(async(req, res) =>{
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}));

router.get('/logout', (req, res, next) =>{
    req.logout(function (err){
        if(err){
            return next(err);
        }
    });
    req.flash('success', 'You are logged out!');
    res.redirect('/campgrounds');
});

module.exports = router;