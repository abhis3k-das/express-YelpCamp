const express = require('express');
const router = express.Router();
const Campground = require('../model/campground');
const catchAsync = require('../utils/catchAsync');
const { validateForm } = require('../utils/joiSchema');
const User = require('../model/user');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });
const campgrounds = require('../controllers/campgrounds')

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

router.route('')
    .get(catchAsync(campgrounds.index))
    .post(User.loginMiddleware, upload.array('image'), validateForm, catchAsync(campgrounds.createNewCampground));


router.get('/new', User.loginMiddleware, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.renderCampground))
    .put(User.loginMiddleware, isAuthor, upload.array('image'), validateForm, catchAsync(campgrounds.editCampground))
    .delete(User.loginMiddleware, isAuthor, campgrounds.deleteCampground)

router.get('/:id/edit', User.loginMiddleware, isAuthor, catchAsync(campgrounds.renderEditForm))
module.exports = router;