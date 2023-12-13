const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
};

module.exports.renderNewForm = (req, res) =>{
    res.render('campgrounds/new');
};

module.exports.showCampground = async (req, res) => {
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
};

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(imgObj => {
        return {url: imgObj.path, filename: imgObj.filename};
    });
    campground.author = req.user._id;
    await campground.save();
    //flashing a success message to the user once the campground has been created successfully and saved to the database.
    req.flash('success', 'Successfully added a new Campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
};

module.exports.updateCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {runValidators: true});
    const newImages = req.files.map((imgObj) => {
        return {url: imgObj.path, filename: imgObj.filename}
    });
    campground.images.push(...newImages);
    campground.save();
    //Deleting selected images on the found campground
    if(req.body.deleteImages){
        //Delete the checkbox selected files whose filename is stored in the req.body.deleteImages array from cloudinary itself
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        //pull from the "images" array in the found campground where the filename is in "req.body.deleteImages"
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
};