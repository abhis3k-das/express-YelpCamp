if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
console.log(process.env.CLOUDINARY_SECRET);

const express = require('express');
const app = express();
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./model/user');


const userRoutes = require('./routes/user')
const campRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/review');


app.engine('ejs', ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'thisShouldBeInEnv',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const DB = 'yelpCampWeb'
mongoose.connect(`mongodb://127.0.0.1:27017/${DB}`)
    .then(() => {
        console.log('Connected to ' + DB)
    })
    .catch((err) => {
        console.log('Connection Failed.')
    })


app.use((req, res, next) => {
    res.locals.message = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.isLoggedIn = req.isAuthenticated();
    res.locals.user = req.user
    next();
})

app.get('/home', (req, res) => {
    res.send({ message: 'Hello' })
})
app.use('/', userRoutes);
app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    let { message, status } = err
    const errorList = []
    if (status && status !== 400 && status !== 404) {
        console.log("here")
        const errorsKey = Object.keys(err.errors)
        for (let each of errorsKey) {
            errorList.push(err.errors[each].properties.message)
        }
    }
    else {
        status = 500
        errorList.push(message)
    }
    res.render('errors', { errorList, status })
})

app.listen(3000, () => {
    console.log('Connected to Port 3000')
})
