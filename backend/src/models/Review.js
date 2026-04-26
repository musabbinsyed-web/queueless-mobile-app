const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: String, ref: 'Provider', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

// Ensure a user can only review a specific booking once
reviewSchema.index({ bookingId: 1 }, { unique: true });

// Post save hook to update provider average rating
reviewSchema.post('save', async function () {
  const providerId = this.providerId;
  const Review = this.constructor;

  const stats = await Review.aggregate([
    { $match: { providerId: providerId } },
    { $group: { _id: '$providerId', averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Provider').findByIdAndUpdate(providerId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
