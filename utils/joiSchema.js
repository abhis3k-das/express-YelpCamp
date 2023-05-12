const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
const Joi = BaseJoi.extend(extension)
const ExpressError = require('./ExpressError')
module.exports.validateForm = (req, res, next) => {
    const campgroundSchema = Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required(),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        options: Joi.array(),
    })
    const { error } = campgroundSchema.validate(req.body, { abortEarly: false })
    if (error) {
        const msg = error.details.map((er) => er.message).join(',')
        throw new ExpressError(msg + ' from JOI', 400)
    }
    return next();
}

module.exports.validateReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        review: Joi.string().required().escapeHTML(),
        rating: Joi.number().min(1).max(5).required(),
    })
    const { error } = reviewSchema.validate(req.body, { abortEarly: false })
    if (error) {
        const msg = error.details.map((err) => err.message).join(',')
        throw new ExpressError(msg + 'from JOI', 400)
    }
    return next();
}


