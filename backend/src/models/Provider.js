const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: String, required: true }, // e.g. '45 min'
  price: { type: String, required: true }, // e.g. '$125' or 'Varies'
});

serviceSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

serviceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  },
});

const providerSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // custom ID like 'prov-hosp-pmc'
    name: { type: String, required: true },
    categoryId: { type: String, ref: 'Category', required: true },
    imageUrl: { type: String },
    rating: { type: Number, default: 4.0 },
    location: { type: String, required: true },
    busyness: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'low',
    },
    currentVisitors: { type: Number, default: 0 },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    services: [serviceSchema],
    queue: {
      nowServing: { type: Number, default: 0 },
      nextToken: { type: Number, default: 1 },
    },
  },
  { timestamps: true }
);

// Map image to frontend property
providerSchema.virtual('image').get(function () {
  return this.imageUrl;
});

providerSchema.virtual('id').get(function () {
  return this._id;
});

providerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Provider', providerSchema);
