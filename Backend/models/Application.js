const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  proposedRate: {
    type: Number,
    required: true
  },
  estimatedDuration: {
    type: String,
    required: true
  },
  attachments: [{
    filename: String,
    url: String
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  clientNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure one application per student per gig
applicationSchema.index({ gig: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
