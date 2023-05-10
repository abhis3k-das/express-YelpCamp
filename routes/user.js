const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../model/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
router.get('/register', (req, res) => {
    res.render('users/register')
})
router.post('/register', catchAsync(async (req, res, next) => {
    try {

        const user = new User({
            email: req.body.email,
            username: req.body.username,
        })
        const newUser = await User.register(user, req.body.password);
        req.login(newUser, (err) => {
            if (err) { return next(err) }
            req.flash('success', 'User Created');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))
router.get('/login', (req, res) => {
    res.render('users/login');
})
router.post('/login', (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
}), async (req, res, next) => {
    req.flash('success', 'Welcome back!!')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
})
router.get('/logout', (req, res, next) => {
    req.logout(
        function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Goodbye!');
            res.redirect('/campgrounds');
        }
    )
})
module.exports = router;