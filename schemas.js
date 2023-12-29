const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

/**Defining an extension on JOI.String called escapeHTML. escapeHTML is an object that has a method called 'validate' that JOI calls automatically which helps us sanitize specified form inputs using the 'sanitize-html' package. This package exposes a method we can use that recieves a string value & a sanitize options object which specifies how and what we want to sanitize.
 * 
 * We can now use this user-defined 'escapeHTML' method as our own defined extension on any string coming in from our form body like: 
 * 'name: Joi.string().required().escapeHTML()'
*/
const extension = (joi) =>({
    type: 'string',   //Specifies that the extension is for string data types.
    base: joi.string(), //Defines the base type as a string
    messages: {  //Custom messages for the new rule, useful for error handling
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {  // Defines one or more custom validation rules
        escapeHTML: {

            /**
             * 
             * @param {string} value The actual string value to be validated
             * @param {object} [helpers] A set of utility functions provided by JOI to help in custom validation (like throwing errors)
             * @returns {string}
             */
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });

                if(clean !== value) return helpers.error('string.escapeHTML', {value});

                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);  // extends the base Joi functionality with the defined extension.

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // images: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});