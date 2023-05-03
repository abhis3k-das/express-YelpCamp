const express = require('express');
const app = express();
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const Campground = require('./model/campground')


app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const DB = 'yelpCampWeb'
mongoose.connect(`mongodb://127.0.0.1:27017/${DB}`)
    .then(() => {
        console.log('Connected to ' + DB)
    })
    .catch((err) => {
        console.log('Connection Failed.')
    })



app.get('/', (req, res) => {
    res.send({ message: 'Hello' })
})
app.get('/campgrounds', async (req, res) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds })
    } catch (err) {
        res.send(err)
    }

})
app.post('/campgrounds', async (req, res) => {
    const newCamp = new Campground({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        location: req.body.location,
    })
    const response = await newCamp.save();
    console.log(response)
    res.redirect(`/campgrounds/${response._id}`)
})
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { camp })
})
app.put('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        location: req.body.location,
    }, { new: true })
    console.log(camp)
    res.redirect('/campgrounds')

})
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id);
    res.render('campgrounds/show', { camp });
})
app.delete('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id);
    console.log(camp)
    res.redirect('/campgrounds')
})
app.listen(3000, () => {
    console.log('Connected to Port 3000')
})
