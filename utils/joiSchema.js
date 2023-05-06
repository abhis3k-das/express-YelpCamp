const Joi = require('joi')
const ExpressError = require('./ExpressError')
module.exports = (req, res, next) => {
    const campgroundSchema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
    })
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map((er) => er.message).join(',')
        throw new ExpressError(msg + ' from JOI', 400)
    }
    return next();
}