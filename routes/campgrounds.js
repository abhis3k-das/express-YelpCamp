const express = require('express');
const router = express.Router();
const Campground = require('../model/campground');
const catchAsync = require('../utils/catchAsync');
const { validateForm } = require('../utils/joiSchema');
const User = require('../model/user');
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


router.get('', catchAsync(campgrounds.index))
router.post('', User.loginMiddleware, validateForm, catchAsync(campgrounds.createNewCampground));
router.get('/new', User.loginMiddleware, campgrounds.renderNewForm);
router.get('/:id/edit', User.loginMiddleware, isAuthor, catchAsync(campgrounds.renderEditForm))
router.put('/:id', User.loginMiddleware, isAuthor, validateForm, catchAsync(campgrounds.editCampground))
router.get('/:id', catchAsync(campgrounds.renderCampground))
router.delete('/:id', User.loginMiddleware, isAuthor, campgrounds.deleteCampground)

module.exports = router;