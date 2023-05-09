const express = require('express');
const app = express();
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const Campground = require('./model/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { validateForm, validateReview } = require('./utils/joiSchema');
const Review = require('./model/review');
app.engine('ejs', ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))

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
app.get('/', (req, res) => {
    res.send({ message: 'Hello' })
})



app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))
app.post('/campgrounds', validateForm, catchAsync(async (req, res, next) => {
    const newCamp = new Campground({
        title: req.body.title,
        price: parseFloat(req.body.price),
        description: req.body.description,
        location: req.body.location,
        image: req.body.image
    })
    const response = await newCamp.save();
    res.redirect(`/campgrounds/${response._id}`)
}))
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { camp })
}))
app.put('/campgrounds/:id', validateForm, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        location: req.body.location,
    }, { new: true })
    console.log(camp)
    res.redirect(`/campgrounds/${req.body._id}`)
}))
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate('reviews');
    console.log(camp)
    if (!camp) {
        throw new ExpressError("Id Not Found", 500)
    }
    res.render('campgrounds/show', { camp });
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        throw new ExpressError("Id Not Found", 500);
    }
    const review = new Review({
        body: req.body.review,
        rating: req.body.rating,
    })
    camp.reviews.push(review);
    const response = await review.save();
    console.log(response)
    await camp.save();
    res.redirect(`/campgrounds/${id}`)
}))
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        throw new ExpressError("Id not found", 404);
    }
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    res.redirect(`/campgrounds/${id}`)
}))
app.delete('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id);
    console.log(camp)
    res.redirect('/campgrounds')
})

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
