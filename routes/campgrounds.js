const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas'); //can be re-written as "const campgroundSchema = require('../schemas').campgroundSchema"

//Campgrounds validation middleware using Joi
const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }else{ next(); }
}

router.get('/', catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', (req, res) =>{
    res.render('campgrounds/new');
});

router.get('/:id', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
        // throw new ExpressError('Campground not found', 404);
        
    }
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));

router.post('/', validateCampground, catchAsync( async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    //flashing a success message to the user once the campground has been created successfully and saved to the database.
    req.flash('success', 'Successfully added a new Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.put('/:id', validateCampground, catchAsync( async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {runValidators: true});
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync( async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
})); 

module.exports = router;