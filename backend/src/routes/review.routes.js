const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticateJWT } = require('../middleware/auth');

router.post('/', authenticateJWT, reviewController.submitReview);
router.get('/:providerId', reviewController.getProviderReviews);

module.exports = router;
