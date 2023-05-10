// NOTE UNSPLASH allows 50 request per hour
// So COUNT is kept low.
// Note to add key for unsplash



const cities = require('./cities')
const Campground = require('../model/campground')
const names = require('./names');

const mongoose = require('mongoose')
const DB = 'yelpCampWeb'
const COUNT = 20;

require('dotenv').config();

mongoose.connect(`mongodb://127.0.0.1:27017/${DB}`)
    .then(() => {
        console.log('Connected to ' + DB)
    })
    .catch((err) => {
        console.log('Connection Failed.')
    })
async function clearDb() {
    const response = await Campground.deleteMany({});
    console.log(response);
}

const unsplash = require('unsplash-js')
const api = unsplash.createApi({
    accessKey: process.env.UNSPLASH_KEY
});

async function createDb() {
    const campList = [];
    for (let i = 0; i < 19; i++) {
        let randomIndex = Math.floor(Math.random() * cities.length)
        let dIndex = Math.floor(Math.random() * names.descriptors.length);
        let pIndex = Math.floor(Math.random() * names.places.length);
        let city = cities[randomIndex]
        let image = await api.photos.getRandom({
            collectionIds: ['3867746', '11710947'],
            count: 1,
        })
        let newCamp = {
            title: names.descriptors[dIndex] + ' ' + names.places[pIndex],
            author: "645b07b1abed3f8f558cd10a",
            price: Math.floor(Math.random() * 300 + 100),
            description: `Its in ${city.state} , with a population of ${city.population} and ranks ${city.rank}.`,
            location: city.city,
            image: image.response[0].urls.regular,
        }
        campList.push(newCamp);
    }
    console.log(campList)
    await Campground.insertMany(campList)
        .then((res) => {
            mongoose.connection.close();
        })
        .catch((err) => {
            console.log(err)
        })
}
clearDb()
createDb();
