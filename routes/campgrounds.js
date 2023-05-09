const express = require('express');
const router = express.Router();
const Campground = require('../model/campground');
const catchAsync = require('../utils/catchAsync');
const { validateForm } = require('../utils/joiSchema');
const ExpressError = require('../utils/ExpressError');

router.get('', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))
router.post('', validateForm, catchAsync(async (req, res, next) => {
    const newCamp = new Campground({
        title: req.body.title,
        price: parseFloat(req.body.price),
        description: req.body.description,
        location: req.body.location,
        image: req.body.image
    })
    const response = await newCamp.save();
    req.flash('success', 'Campground created successfully.  ')
    res.redirect(`/campgrounds/${response._id}`)
}))
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})
router.get('/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    if (!camp) {
        // throw new ExpressError("Id Not Found", 500)
        req.flash('error', 'Campground not Found')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { camp })
}))
router.put('/:id', validateForm, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        location: req.body.location,
    }, { new: true })
    req.flash('success', 'Campground details modified successfully.')
    res.redirect(`/campgrounds/${req.body._id}`)
}))
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate('reviews');
    if (!camp) {
        // throw new ExpressError("Id Not Found", 500)
        req.flash('error', 'Campground not Found')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { camp });
}))
router.delete('/:id', async (req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground deleted successfully.')
    res.redirect('/campgrounds')
})
module.exports = router;