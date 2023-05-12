// NOTE UNSPLASH allows 50 request per hour
// So COUNT is kept low.
// Note to add key for unsplash



const cities = require('./cities')
const Campground = require('../model/campground')
const names = require('./names');

const mongoose = require('mongoose')
const DB = 'yelpCampWeb'
const COUNT = 20;
// require('dotenv').config();

console.log(process.env.MAPBOX_TOKKEN)
mongoose.connect(`mongodb://127.0.0.1:27017/${DB}`)
    .then(() => {
        console.log('Connected to ' + DB)
    })
    .catch((err) => {
        console.log('Connection Failed.')
    })

// const unsplash = require('unsplash-js')
// const api = unsplash.createApi({
//     accessKey: process.env.UNSPLASH_KEY
// });

async function createDb() {
    await Campground.deleteMany({});
    const campList = [];
    for (let i = 0; i < 200; i++) {
        let randomIndex = Math.floor(Math.random() * cities.length)
        let dIndex = Math.floor(Math.random() * names.descriptors.length);
        let pIndex = Math.floor(Math.random() * names.places.length);
        let city = cities[randomIndex]
        // let image = await api.photos.getRandom({
        //     collectionIds: ['3867746', '11710947'],
        //     count: 1,
        // })
        let image = [
            {
                url: "https://res.cloudinary.com/dyiasu9hz/image/upload/v1683870914/yelpCampWeb/nwoeazhh82xzi8gcuzur.jpg",
                filename: "yelpCampWeb/nwoeazhh82xzi8gcuzur",
                _id: "645dd4c2784d016d5051e146"
            },
            {
                url: "https://res.cloudinary.com/dyiasu9hz/image/upload/v1683870915/yelpCampWeb/kw1gfmihvekewnbzgjjx.jpg",
                filename: "yelpCampWeb/kw1gfmihvekewnbzgjjx",
                _id: "645dd4c2784d016d5051e147"
            }
        ]
        let newCamp = {
            title: names.descriptors[dIndex] + ' ' + names.places[pIndex],
            author: "645b07b1abed3f8f558cd10a",
            price: Math.floor(Math.random() * 300 + 100),
            description: `Its in ${city.state} , with a population of ${city.population} and ranks ${city.rank}.`,
            geometry: { type: "Point", coordinates: [city.longitude, city.latitude] },
            location: city.city,
            // image: image.response[0].urls.regular,
            image: image
        }
        campList.push(newCamp);
    }
    // console.log(campList)
    const response = await Campground.insertMany(campList)
    console.log(response)

}
createDb();
