const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  completion: {
    type:[Date],

  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  target_days_per_week: {
    type: Number,
    required: true,
    min: 1,
    max: 7,
  },
  
}, {
  timestamps: true,
});
habitSchema.pre('save', function(next) {
  if (this.isNew) {
    this.completion = [this.createdAt]; // Initialize completion with createdAt
  }
  next();
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
