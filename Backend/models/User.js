// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  dateOfBirth: {
    type: Date
  },
  role: {
    type: String,
    enum: ['reader', 'writer', 'admin'],
    default: 'reader'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profilePicture: {
    type: String,
    default: ''
  },
  coverPicture: {
    type: String,
    default: ''
  },
  socialLinks: {
    website: String,
    twitter: String,
    facebook: String,
    instagram: String,
    linkedin: String
  },
  location: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  stats: {
    articlesCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Add methods to userSchema
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);