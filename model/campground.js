const mongoose = require('mongoose');
const Review = require('./review');
const opt = { toJSON: { virtuals: true } };
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
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    location: {
        type: Object,
        required: true,
    },
    image: [{
        url: String,
        filename: String,
    }],
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }]
}, opt)

campSchema.virtual('properties.popUpMarkup').get(function () {
    return `<h6><a href='/campgrounds/${this._id}'>${this.title}</a></h6><p>${this.location}</p>`
})
campSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})
const Campground = mongoose.model('campground', campSchema)
module.exports = Campground