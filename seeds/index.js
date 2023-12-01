const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp_camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Database connection established');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB =  async () =>{
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '656130aa420afe24a2a6e8c2',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae quae quasi nesciunt beatae? Laboriosam fugiat fuga maiores officiis tempora natus magnam saepe quibusdam eos vel',
            price
        });
        await camp.save();
    }
};   

seedDB().then(() => {
    mongoose.connection.close();
});