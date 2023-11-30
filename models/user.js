const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose); //Adding passport-local-mongoose static methods to our user model.

module.exports = mongoose.model('User', userSchema);