const cities = require('./cities')
const Campground = require('../model/campground')
const names = require('./names');

const mongoose = require('mongoose')
const DB = 'yelpCampWeb'
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
async function createDb() {
    const campList = [];
    for (let i = 0; i < 50; i++) {
        let randomIndex = Math.floor(Math.random() * cities.length)
        let dIndex = Math.floor(Math.random() * names.descriptors.length);
        let pIndex = Math.floor(Math.random() * names.places.length);
        let city = cities[randomIndex]
        let newCamp = {
            title: names.descriptors[dIndex] + ' ' + names.places[pIndex],
            price: Math.floor(Math.random() * 300 + 100),
            description: `Its in ${city.state} , with a population of ${city.population} and ranks ${city.rank}.`,
            location: city.city
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