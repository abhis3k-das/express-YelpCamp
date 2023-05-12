const Joi = require('joi')
const ExpressError = require('./ExpressError')
module.exports.validateForm = (req, res, next) => {
    const campgroundSchema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string(),
        description: Joi.string().required(),
        location: Joi.string().required(),
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
        review: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
    })
    const { error } = reviewSchema.validate(req.body, { abortEarly: false })
    if (error) {
        const msg = error.details.map((err) => err.message).join(',')
        throw new ExpressError(msg + 'from JOI', 400)
    }
    return next();
}