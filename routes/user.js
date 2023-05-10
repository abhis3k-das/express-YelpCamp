const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../model/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users')

router.get('/register', users.index);
router.post('/register', catchAsync(users.createNewUser));
router.get('/login', users.renderLoginPage)

router.post('/login', (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
}), users.loginUser)

router.get('/logout', users.logoutUser)
module.exports = router;