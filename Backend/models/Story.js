import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['protagonist', 'antagonist', 'supporting', 'other'],
    default: 'other'
  }
});

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Story description is required'],
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: [true, 'Story content is required']
  },
  coverImage: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  bannerImage: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  mainCharacters: [characterSchema],
  targetAudience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TargetAudience',
    required: true
  },
  language: {
    type: String,
    required: true,
    default: 'English'
  },
  copyright: {
    type: String,
    enum: ['all-rights-reserved', 'creative-commons', 'public-domain'],
    default: 'all-rights-reserved'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Update likes count when likes array changes
storySchema.pre('save', function(next) {
  this.likesCount = this.likes.length;
  next();
});

export default mongoose.model('Story', storySchema);