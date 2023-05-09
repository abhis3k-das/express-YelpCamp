const mongoose = require('mongoose');
const reviewSchema = mongoose.Schema({
    body: String,
    rating: Number,
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;