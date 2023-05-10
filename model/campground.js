const mongoose = require('mongoose');
const Review = require('./review');
const campSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: Object,
        required: true,
    },
    image: {
        type: String,
        required: [true, "Please provide a valid url"]
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }]
})
campSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})
const Campground = mongoose.model('campground', campSchema)
module.exports = Campground