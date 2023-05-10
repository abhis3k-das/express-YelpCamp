const Review = require('../model/review');
const Campground = require('../model/campground');
const ExpressError = require('../utils/ExpressError');
module.exports.index = async (req, res) => {
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
}

module.exports.deleteReview = async (req, res) => {
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
}