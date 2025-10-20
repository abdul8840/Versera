import { validationResult } from 'express-validator';
import TargetAudience from '../models/TargetAudience.js';

// @desc    Create target audience
// @route   POST /api/admin/target-audiences
// @access  Private/Admin
export const createTargetAudience = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, description, minAge } = req.body;

    // Check if target audience already exists
    const existingAudience = await TargetAudience.findOne({ title });
    if (existingAudience) {
      return res.status(400).json({
        success: false,
        message: 'Target audience with this title already exists'
      });
    }

    const targetAudience = await TargetAudience.create({
      title,
      description,
      minAge,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Target audience created successfully',
      targetAudience
    });

  } catch (error) {
    console.error('Create target audience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating target audience'
    });
  }
};

// @desc    Get all target audiences
// @route   GET /api/target-audiences
// @access  Public

export const getTargetAudiences = async (req, res) => {
  try {
    console.log('Fetching target audiences from database...');
    
    const targetAudiences = await TargetAudience.find({ isActive: true })
      .populate('createdBy', 'firstName lastName')
      .sort({ minAge: 1 });

    console.log('Found target audiences:', targetAudiences.length);

    res.json({
      success: true,
      count: targetAudiences.length,
      targetAudiences
    });

  } catch (error) {
    console.error('Get target audiences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching target audiences'
    });
  }
};

// @desc    Update target audience
// @route   PUT /api/admin/target-audiences/:id
// @access  Private/Admin
export const updateTargetAudience = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const targetAudience = await TargetAudience.findById(req.params.id);
    if (!targetAudience) {
      return res.status(404).json({
        success: false,
        message: 'Target audience not found'
      });
    }

    const { title, description, minAge, isActive } = req.body;

    // Check if title is being changed and if it already exists
    if (title && title !== targetAudience.title) {
      const existingAudience = await TargetAudience.findOne({ title });
      if (existingAudience) {
        return res.status(400).json({
          success: false,
          message: 'Target audience with this title already exists'
        });
      }
      targetAudience.title = title;
    }

    if (description) targetAudience.description = description;
    if (minAge) targetAudience.minAge = minAge;
    if (typeof isActive !== 'undefined') targetAudience.isActive = isActive;

    await targetAudience.save();

    res.json({
      success: true,
      message: 'Target audience updated successfully',
      targetAudience
    });

  } catch (error) {
    console.error('Update target audience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating target audience'
    });
  }
};

// @desc    Delete target audience
// @route   DELETE /api/admin/target-audiences/:id
// @access  Private/Admin
export const deleteTargetAudience = async (req, res) => {
  try {
    const targetAudience = await TargetAudience.findById(req.params.id);
    if (!targetAudience) {
      return res.status(404).json({
        success: false,
        message: 'Target audience not found'
      });
    }

    await TargetAudience.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Target audience deleted successfully'
    });

  } catch (error) {
    console.error('Delete target audience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting target audience'
    });
  }
};