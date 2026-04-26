const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  _id: {
    type: String, // e.g. 'cat-hospital'
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true, // 'hospital' | 'salon' | 'college' | 'restaurant'
  },
});

// Virtual for id to match the string _id
categorySchema.virtual('id').get(function () {
  return this._id;
});

categorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Category', categorySchema);
