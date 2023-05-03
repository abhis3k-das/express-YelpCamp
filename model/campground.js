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
    }
})

const Campground = mongoose.model('campground', campSchema)
module.exports = Campground