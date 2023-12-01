const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

router.get('/', catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', isLoggedIn, (req, res) =>{
    res.render('campgrounds/new');
});

router.get('/:id', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
        // throw new ExpressError('Campground not found', 404);
        
    }
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));

router.post('/', isLoggedIn, validateCampground, catchAsync( async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    //flashing a success message to the user once the campground has been created successfully and saved to the database.
    req.flash('success', 'Successfully added a new Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync( async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {runValidators: true});
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync( async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
})); 

module.exports = router;