const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticateJWT } = require('../middleware/auth');

router.post('/', authenticateJWT, bookingController.bookToken);
router.get('/', authenticateJWT, bookingController.getUserBookings);
router.get('/:bookingId', authenticateJWT, bookingController.getBookingById);

module.exports = router;
