import mongoose from 'mongoose';

const targetAudienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Target audience title is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Target audience description is required'],
    maxlength: 200
  },
  minAge: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('TargetAudience', targetAudienceSchema);