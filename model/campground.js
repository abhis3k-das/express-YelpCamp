const mongoose = require('mongoose');
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
        required: true,
    }
})

const Campground = mongoose.model('campground', campSchema)
module.exports = Campground