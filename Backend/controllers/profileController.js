// controllers/profileController.js
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import cloudinary from '../utils/cloudinary.js';

// @desc    Get user profile
// @route   GET /api/profile/:userId
// @access  Public
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -otp -resetPasswordToken -resetPasswordExpire');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/update
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      bio,
      location,
      website,
      twitter,
      facebook,
      instagram,
      linkedin
    } = req.body;

    const updateData = {
      firstName,
      lastName,
      bio,
      location,
      socialLinks: {
        website,
        twitter,
        facebook,
        instagram,
        linkedin
      }
    };

    // Remove undefined social links
    Object.keys(updateData.socialLinks).forEach(key => {
      if (!updateData.socialLinks[key]) {
        delete updateData.socialLinks[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -otp -resetPasswordToken -resetPasswordExpire');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Upload profile picture to Cloudinary
// @route   PUT /api/profile/upload-avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const avatar = req.files.avatar;

    // Check file type
    if (!avatar.mimetype.startsWith('image')) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Check file size (max 5MB)
    if (avatar.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size must be less than 5MB'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(avatar.tempFilePath, {
      folder: 'versera/avatars',
      width: 500,
      height: 500,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    });

    // Delete old avatar from Cloudinary if exists
    if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      const fullPublicId = `versera/avatars/${publicId}`;
      await cloudinary.uploader.destroy(fullPublicId);
    }

    user.profilePicture = result.secure_url;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading profile picture'
    });
  }
};

// @desc    Upload cover picture to Cloudinary
// @route   PUT /api/profile/upload-cover
// @access  Private
export const uploadCover = async (req, res) => {
  try {
    if (!req.files || !req.files.cover) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const cover = req.files.cover;

    // Check file type
    if (!cover.mimetype.startsWith('image')) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Check file size (max 10MB)
    if (cover.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size must be less than 10MB'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(cover.tempFilePath, {
      folder: 'versera/covers',
      width: 1200,
      height: 400,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    });

    // Delete old cover from Cloudinary if exists
    if (user.coverPicture && user.coverPicture.includes('cloudinary')) {
      const publicId = user.coverPicture.split('/').pop().split('.')[0];
      const fullPublicId = `versera/covers/${publicId}`;
      await cloudinary.uploader.destroy(fullPublicId);
    }

    user.coverPicture = result.secure_url;
    await user.save();

    res.json({
      success: true,
      message: 'Cover picture updated successfully',
      coverPicture: user.coverPicture
    });

  } catch (error) {
    console.error('Upload cover error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading cover picture'
    });
  }
};

// @desc    Get current user's full profile
// @route   GET /api/profile/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -otp -resetPasswordToken -resetPasswordExpire');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};