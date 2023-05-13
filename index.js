if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');

const url = process.env.MONGO_ATLAS || `mongodb://127.0.0.1:27017/yelpCampWeb`;
const secret = process.env.SECRET || 'thisShouldBeInEnv';
mongoose.connect(url)
    .then(() => {
        console.log('Connected to DB')
    })
    .catch((err) => {
        console.log(err)
    })


const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./model/user');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet');
const MongoDBStore = require('connect-mongo')(session);

const userRoutes = require('./routes/user')
const campRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/review');


app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
const store = new MongoDBStore({
    url: url,
    secret: secret,
    touchAfter: 24 * 60 * 60, //seconds

})

store.on("error", function (e) {
    console.log("session store error")
})
app.use(session({
    store: store,
    name: 'my_Session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true, // if this is set site will only work in https only not on http and localhost is not secure so it wont work.
        // set this at development time
    }
}))
app.use(mongoSanitize())
app.use(helmet())
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dyiasu9hz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))



app.use((req, res, next) => {
    res.locals.message = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.isLoggedIn = req.isAuthenticated();
    res.locals.user = req.user
    next();
})

app.get('/home', (req, res) => {
    res.render('home')
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

