const express = require('express');
const router = express.Router();
const Campground = require('../model/campground');
const catchAsync = require('../utils/catchAsync');
const { validateForm } = require('../utils/joiSchema');
const ExpressError = require('../utils/ExpressError');
const User = require('../model/user');


const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


router.get('', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))
router.post('', User.loginMiddleware, validateForm, catchAsync(async (req, res, next) => {
    const newCamp = new Campground({
        title: req.body.title,
        author: req.user._id,
        price: parseFloat(req.body.price),
        description: req.body.description,
        location: req.body.location,
        image: req.body.image
    })
    const response = await newCamp.save();
    req.flash('success', 'Campground created successfully.  ')
    res.redirect(`/campgrounds/${response._id}`)
}))
router.get('/new', User.loginMiddleware, (req, res, next) => {
    res.render('campgrounds/new')
})
router.get('/:id/edit', User.loginMiddleware, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
    if (!camp) {
        // throw new ExpressError("Id Not Found", 500)
        req.flash('error', 'Campground not Found')
        return res.redirect('/campgrounds')
    }
    return res.render('campgrounds/edit', { camp })
}))
router.put('/:id', User.loginMiddleware, isAuthor, validateForm, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const updatedCamp = await Campground.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        location: req.body.location,
        author: req.user._id
    }, { new: true })
    req.flash('success', 'Campground details modified successfully.')
    return res.redirect(`/campgrounds/${updatedCamp._id}`)


}))
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!camp) {
        // throw new ExpressError("Id Not Found", 500)
        req.flash('error', 'Campground not Found')
        res.redirect('/campgrounds')
    }

    res.render('campgrounds/show', { camp });
}))
router.delete('/:id', User.loginMiddleware, isAuthor, async (req, res) => {

    const camp = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground deleted successfully.')
    res.redirect('/campgrounds')

})
module.exports = router;