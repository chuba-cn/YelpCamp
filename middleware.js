const {campgroundSchema, reviewSchema} = require('./schemas'); //can be re-written as "const campgroundSchema = require('./schemas').campgroundSchema"
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //store the url the user is requesting access to
        // ! bug fix:-> req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

//Campgrounds validation middleware using Joi
module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }else{ next(); }
};

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    //checking to see if the campground author is the current logged in user
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

//Reviews validation middleware using Joi
module.exports.validateReview = (req, res, next) => {
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }else{ next(); }
}

module.exports.isReviewAuthor = async (req, res, next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    //checking to see if the review author is the current logged in user
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};