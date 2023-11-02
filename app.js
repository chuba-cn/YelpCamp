const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const PORT = process.env.PORT || 3000;
const path = require('path');
const {campgroundSchema} = require('./schemas');
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://127.0.0.1:27017/yelp_camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Database connection established');
});

app.engine('ejs', ejsMate);

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('campgrounds/home');
});

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }else{ next(); }
}

app.get('/campgrounds', catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
}));

app.get('/campgrounds/:id/edit', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}));

app.post('/campgrounds', validateCampground, catchAsync( async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.put('/campgrounds/:id', validateCampground, catchAsync( async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {runValidators: true});
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync( async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
})); 

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404));
});

app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err});
});

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});