const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile App',
      'Design',
      'Writing',
      'Marketing',
      'Data Entry',
      'Tutoring',
      'Research',
      'Data Science',
      'Video Editing',
      'Other'
    ]
  },
  skillsRequired: [{
    type: String
  }],
  budget: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    type: { type: String, enum: ['fixed', 'hourly', 'monthly', 'per video'], default: 'fixed' }
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  hiredStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: 'Remote'
  }
}, {
  timestamps: true
});

// Index for search
gigSchema.index({ title: 'text', description: 'text', skillsRequired: 'text' });

module.exports = mongoose.model('Gig', gigSchema);
