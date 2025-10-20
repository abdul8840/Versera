import { validationResult } from 'express-validator';
import Story from '../models/Story.js';
import Category from '../models/Category.js';
import TargetAudience from '../models/TargetAudience.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Create story
// @route   POST /api/writer/stories
// @access  Private/Writer
// In backend/controllers/storyController.js - Update createStory function

export const createStory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      content,
      categories,
      tags,
      mainCharacters,
      targetAudience,
      language,
      copyright,
      status
    } = req.body;

    // Parse JSON fields
    let categoriesArray = [];
    let tagsArray = [];
    let charactersArray = [];

    try {
      categoriesArray = JSON.parse(categories);
      tagsArray = JSON.parse(tags);
      charactersArray = JSON.parse(mainCharacters);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format for categories, tags, or characters'
      });
    }

    // Validate categories
    const categoryDocs = await Category.find({ 
      _id: { $in: categoriesArray },
      isActive: true 
    });
    
    if (categoryDocs.length !== categoriesArray.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more categories are invalid'
      });
    }

    // Validate target audience
    const audienceDoc = await TargetAudience.findOne({ 
      _id: targetAudience,
      isActive: true 
    });
    
    if (!audienceDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target audience'
      });
    }

    // Upload cover image
    let coverImageResult;
    if (req.files && req.files.coverImage) {
      coverImageResult = await cloudinary.uploader.upload(req.files.coverImage.tempFilePath, {
        folder: 'versera/stories/cover'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Cover image is required'
      });
    }

    // Upload banner image
    let bannerImageResult;
    if (req.files && req.files.bannerImage) {
      bannerImageResult = await cloudinary.uploader.upload(req.files.bannerImage.tempFilePath, {
        folder: 'versera/stories/banner'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Banner image is required'
      });
    }

    const story = await Story.create({
      title,
      description,
      content,
      coverImage: {
        public_id: coverImageResult.public_id,
        url: coverImageResult.secure_url
      },
      bannerImage: {
        public_id: bannerImageResult.public_id,
        url: bannerImageResult.secure_url
      },
      author: req.user.id,
      categories: categoriesArray,
      tags: tagsArray,
      mainCharacters: charactersArray,
      targetAudience,
      language,
      copyright,
      status,
      publishedAt: status === 'published' ? new Date() : null
    });

    const populatedStory = await Story.findById(story._id)
      .populate('author', 'firstName lastName profilePicture')
      .populate('categories', 'name image')
      .populate('targetAudience', 'title minAge');

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      story: populatedStory
    });

  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating story'
    });
  }
};

// @desc    Get all stories with filters
// @route   GET /api/stories
// @access  Public
export const getStories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      author,
      targetAudience,
      language,
      status = 'published',
      search
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { status, isActive: true };

    // Apply filters
    if (category) query.categories = category;
    if (author) query.author = author;
    if (targetAudience) query.targetAudience = targetAudience;
    if (language) query.language = language;

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const stories = await Story.find(query)
      .populate('author', 'firstName lastName profilePicture')
      .populate('categories', 'name image')
      .populate('targetAudience', 'title minAge')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalStories = await Story.countDocuments(query);

    res.json({
      success: true,
      count: stories.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalStories / limit),
        totalStories,
        hasNext: page < Math.ceil(totalStories / limit),
        hasPrev: page > 1
      },
      stories
    });

  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stories'
    });
  }
};

// @desc    Get single story
// @route   GET /api/stories/:id
// @access  Public
export const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'firstName lastName profilePicture bio')
      .populate('categories', 'name image')
      .populate('targetAudience', 'title minAge description');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Increment views
    if (story.status === 'published') {
      story.views += 1;
      await story.save();
    }

    res.json({
      success: true,
      story
    });

  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching story'
    });
  }
};

// @desc    Update story
// @route   PUT /api/writer/stories/:id
// @access  Private/Writer
export const updateStory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Check if user is the author
    if (story.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this story'
      });
    }

    const {
      title,
      description,
      content,
      categories,
      tags,
      mainCharacters,
      targetAudience,
      language,
      copyright,
      status
    } = req.body;

    // Update fields
    if (title) story.title = title;
    if (description) story.description = description;
    if (content) story.content = content;
    if (language) story.language = language;
    if (copyright) story.copyright = copyright;

    // Update categories if provided
    if (categories) {
      // --- FIX IS HERE ---
      let categoriesArray;
      try {
        categoriesArray = JSON.parse(categories);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid categories format'
        });
      }

      const categoryDocs = await Category.find({ 
        _id: { $in: categoriesArray }, // Use the parsed array
        isActive: true 
      });
      
      if (categoryDocs.length !== categoriesArray.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more categories are invalid'
        });
      }
      story.categories = categoriesArray; // Assign the parsed array
      // --- END OF FIX ---
    }

    // Update target audience if provided
    if (targetAudience) {
      const audienceDoc = await TargetAudience.findOne({ 
        _id: targetAudience,
        isActive: true 
      });
      
      if (!audienceDoc) {
        return res.status(400).json({
          success: false,
          message: 'Invalid target audience'
        });
      }
      story.targetAudience = targetAudience;
    }

    // Update tags if provided
    if (tags) {
      try {
        story.tags = JSON.parse(tags);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid tags format'
        });
      }
    }

    // Update main characters if provided
    if (mainCharacters) {
      try {
        story.mainCharacters = JSON.parse(mainCharacters);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid main characters format'
        });
      }
    }

    // Update cover image if provided
    if (req.files && req.files.coverImage) {
      // Delete old cover image
      await cloudinary.uploader.destroy(story.coverImage.public_id);

      // Upload new cover image
      const coverImageResult = await cloudinary.uploader.upload(req.files.coverImage.tempFilePath, {
        folder: 'versera/stories/cover'
      });

      story.coverImage = {
        public_id: coverImageResult.public_id,
        url: coverImageResult.secure_url
      };
    }

    // Update banner image if provided
    if (req.files && req.files.bannerImage) {
      // Delete old banner image
      await cloudinary.uploader.destroy(story.bannerImage.public_id);

      // Upload new banner image
      const bannerImageResult = await cloudinary.uploader.upload(req.files.bannerImage.tempFilePath, {
        folder: 'versera/stories/banner'
      });

      story.bannerImage = {
        public_id: bannerImageResult.public_id,
        url: bannerImageResult.secure_url
      };
    }

    // Handle status change
    if (status && status !== story.status) {
      story.status = status;
      if (status === 'published' && !story.publishedAt) {
        story.publishedAt = new Date();
      }
    }

    await story.save();

    const updatedStory = await Story.findById(story._id)
      .populate('author', 'firstName lastName profilePicture')
      .populate('categories', 'name image')
      .populate('targetAudience', 'title minAge');

    res.json({
      success: true,
      message: 'Story updated successfully',
      story: updatedStory
    });

  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating story'
    });
  }
};

// @desc    Delete story
// @route   DELETE /api/writer/stories/:id
// @access  Private/Writer
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Check if user is the author
    if (story.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this story'
      });
    }

    // Delete images from Cloudinary
    await cloudinary.uploader.destroy(story.coverImage.public_id);
    await cloudinary.uploader.destroy(story.bannerImage.public_id);

    await Story.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Story deleted successfully'
    });

  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting story'
    });
  }
};

// @desc    Get writer's stories
// @route   GET /api/writer/stories
// @access  Private/Writer
export const getWriterStories = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = { author: req.user.id, isActive: true };
    if (status) query.status = status;

    const stories = await Story.find(query)
      .populate('categories', 'name image')
      .populate('targetAudience', 'title minAge')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalStories = await Story.countDocuments(query);

    res.json({
      success: true,
      count: stories.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalStories / limit),
        totalStories,
        hasNext: page < Math.ceil(totalStories / limit),
        hasPrev: page > 1
      },
      stories
    });

  } catch (error) {
    console.error('Get writer stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching writer stories'
    });
  }
};

// @desc    Like/Unlike story
// @route   POST /api/stories/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    const userId = req.user.id;
    const likeIndex = story.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      story.likes.splice(likeIndex, 1);
      await story.save();
      res.json({
        success: true,
        message: 'Story unliked',
        liked: false,
        likesCount: story.likesCount
      });
    } else {
      // Like
      story.likes.push(userId);
      await story.save();
      res.json({
        success: true,
        message: 'Story liked',
        liked: true,
        likesCount: story.likesCount
      });
    }

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling like'
    });
  }
};