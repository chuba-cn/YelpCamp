const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//Virtual property on the image schema to derive a new image url with image width size embedded in the url string. Note this virtual property is not stored on mongo.
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:{
        type: [Schema.Types.ObjectId],
        ref: 'Review'
    }
});

CampgroundSchema.post('findOneAndDelete', async function (document){
    if(document){
        await Review.deleteMany({
            _id: {$in : document.reviews}
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);