const User = require('../model/user');
module.exports.index = (req, res) => {
    res.render('users/register')
}
module.exports.createNewUser = async (req, res, next) => {
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
}

module.exports.renderLoginPage = (req, res) => {

    res.render('users/login');
}

module.exports.loginUser = async (req, res, next) => {
    req.flash('success', 'Welcome back!!')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(
        function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Goodbye!');
            res.redirect('/campgrounds');
        }
    )
}