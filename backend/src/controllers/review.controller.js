const Review = require('../models/Review');
const Booking = require('../models/Booking');

exports.submitReview = async (req, res) => {
  try {
    const { providerId, bookingId, rating, comment } = req.body;
    const userId = req.user.id;

    // Verify the booking belongs to the user and is COMPLETED
    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Can only review completed appointments' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this appointment' });
    }

    const review = new Review({
      userId,
      providerId,
      bookingId,
      rating,
      comment
    });

    await review.save();

    // Recalculate average rating for the provider
    const Provider = require('../models/Provider');
    const allReviews = await Review.find({ providerId });
    if (allReviews.length > 0) {
      const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const avgRating = (sum / allReviews.length).toFixed(1);
      
      await Provider.findByIdAndUpdate(providerId, {
        rating: parseFloat(avgRating)
      });
    }

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error submitting review' });
  }
};

exports.getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    const reviews = await Review.find({ providerId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
      
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};
