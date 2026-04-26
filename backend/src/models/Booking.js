const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: String, ref: 'Provider', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    serviceName: { type: String, required: true },
    providerName: { type: String, required: true },
    providerLocation: { type: String },
    providerImage: { type: String },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'ACTIVE',
    },
    tokenNumber: { type: Number, required: true },
    queuePosition: { type: Number }, // Calculated dynamically at read, but stored as snapshot
    referenceCode: { type: String, required: true },
    bookedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

bookingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

bookingSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
