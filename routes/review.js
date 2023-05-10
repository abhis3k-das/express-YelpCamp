const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview } = require('../utils/joiSchema');
const catchAsync = require('../utils/catchAsync');

const User = require('../model/user');
const reviews = require('../controllers/reviews')

router.post('', User.loginMiddleware, validateReview, catchAsync(reviews.index))
router.delete('/:reviewId', User.loginMiddleware, catchAsync(reviews.deleteReview))

module.exports = router;