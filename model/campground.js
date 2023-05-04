const mongoose = require('mongoose');
const campSchema = new mongoose.Schema({
    title: {
        type: String
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    location: {
        type: Object,
    },
    image: {
        type: String,
    }
})

const Campground = mongoose.model('campground', campSchema)
module.exports = Campground