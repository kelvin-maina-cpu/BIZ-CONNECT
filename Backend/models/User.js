const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
  image: { type: String }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'client', 'admin'],
    required: true
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    university: { type: String, default: '' },
    major: { type: String, default: '' },
    graduationYear: { type: Number },
    resume: { type: String, default: '' },
    resumeName: { type: String, default: '' },
    skills: [{ type: String }],
    portfolio: [portfolioItemSchema],
    otherDetails: { type: String, default: '' },
    hourlyRate: { type: Number },
    companyName: { type: String },
    companyWebsite: { type: String },
    location: { type: String }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
