const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../model/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register')
})
router.post('/register', catchAsync(async (req, res) => {
    try {

        const user = new User({
            email: req.body.email,
            username: req.body.username,
        })
        const newUser = await User.register(user, req.body.password);
        req.flash('success', 'User Created');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))
router.get('/login', (req, res) => {
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
}), async (req, res) => {
    req.flash('success', 'Welcome back!!')
    res.redirect('/campgrounds')
})
module.exports = router;