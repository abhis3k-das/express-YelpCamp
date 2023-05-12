const Campground = require('../model/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeoCode = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeoCode({ accessToken: process.env.MAPBOX_TOKEN });


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}
module.exports.renderNewForm = (req, res, next) => {
    res.render('campgrounds/new')
}

module.exports.createNewCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1,
    }).send()
    const newCamp = new Campground({
        title: req.body.title,
        author: req.user._id,
        price: parseFloat(req.body.price),
        description: req.body.description,
        location: req.body.location,
        image: req.body.image
    })
    newCamp.geometry = geoData.body.features[0].geometry
    newCamp.image = req.files.map((each) => ({ url: each.path, filename: each.filename }))
    const response = await newCamp.save();
    req.flash('success', 'Campground created successfully.  ')
    res.redirect(`/campgrounds/${response._id}`)
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
    if (!camp) {
        // throw new ExpressError("Id Not Found", 500)
        req.flash('error', 'Campground not Found')
        return res.redirect('/campgrounds')
    }
    return res.render('campgrounds/edit', { camp })
}

module.exports.editCampground = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1,
    }).send()
    const updatedCamp = await Campground.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        location: req.body.location,
        author: req.user._id
    }, { new: true })
    updatedCamp.geometry = geoData.body.features[0].geometry
    const images = req.files.map((each) => ({ url: each.path, filename: each.filename }))
    updatedCamp.image.push(...images);
    await updatedCamp.save();
    if (req.body.options) {
        for (let filename of req.body.options) {
            await cloudinary.uploader.destroy(filename)
        }
        await updatedCamp.updateOne({ $pull: { image: { filename: { $in: req.body.options } } } })
    }
    req.flash('success', 'Campground details modified successfully.')
    return res.redirect(`/campgrounds/${updatedCamp._id}`)
}

module.exports.renderCampground = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!camp) {
        // throw new ExpressError("Id Not Found", 500)
        req.flash('error', 'Campground not Found')
        res.redirect('/campgrounds')
    }

    res.render('campgrounds/show', { camp });
}

module.exports.deleteCampground = async (req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground deleted successfully.')
    res.redirect('/campgrounds')

}

