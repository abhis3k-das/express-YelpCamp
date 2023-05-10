const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview } = require('../utils/joiSchema');
const catchAsync = require('../utils/catchAsync');
const Review = require('../model/review');
const Campground = require('../model/campground');
const ExpressError = require('../utils/ExpressError');
const User = require('../model/user');


router.post('', User.loginMiddleware, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        throw new ExpressError("Id Not Found", 500);
    }
    const review = new Review({
        body: req.body.review,
        rating: req.body.rating,
        author: req.user._id,
    })
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Review added.')
    res.redirect(`/campgrounds/${id}`)
}))
router.delete('/:reviewId', User.loginMiddleware, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        throw new ExpressError("Id not found", 404);
    }
    if (!req.user._id.equals(reviewId) && camp.author.equals(req.user._id)) {
        req.flash('error', 'Permission denied.')
        return res.redirect(`/campgrounds/${id}`)
    }
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash('success', 'Review deleted.')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;