const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview } = require('../utils/joiSchema');
const catchAsync = require('../utils/catchAsync');
const Review = require('../model/review');
const Campground = require('../model/campground');
const ExpressError = require('../utils/ExpressError');

router.post('', validateReview, catchAsync(async (req, res) => {
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
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${id}`)
}))
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        throw new ExpressError("Id not found", 404);
    }
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;