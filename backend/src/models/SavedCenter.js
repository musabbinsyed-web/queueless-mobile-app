const mongoose = require('mongoose');

const savedCenterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: String, ref: 'Provider', required: true },
  savedAt: { type: Date, default: Date.now },
});

savedCenterSchema.index({ userId: 1, providerId: 1 }, { unique: true });

savedCenterSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('SavedCenter', savedCenterSchema);
