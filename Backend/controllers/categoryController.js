import { validationResult } from 'express-validator';
import Category from '../models/Category.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    // Upload image to Cloudinary
    let imageResult;
    if (req.files && req.files.image) {
      imageResult = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'versera/categories'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Category image is required'
      });
    }

    const category = await Category.create({
      name,
      description,
      image: {
        public_id: imageResult.public_id,
        url: imageResult.secure_url
      },
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating category'
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    console.log('Fetching categories from database...');
    
    const categories = await Category.find({ isActive: true })
      .populate('createdBy', 'firstName lastName')
      .sort({ name: 1 });

    console.log('Found categories:', categories.length);

    res.json({
      success: true,
      count: categories.length,
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const { name, description, isActive } = req.body;

    // Check if name is being changed and if it already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
      category.name = name;
    }

    if (description) category.description = description;
    if (typeof isActive !== 'undefined') category.isActive = isActive;

    // Update image if provided
    if (req.files && req.files.image) {
      // Delete old image
      await cloudinary.uploader.destroy(category.image.public_id);

      // Upload new image
      const imageResult = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'versera/categories'
      });

      category.image = {
        public_id: imageResult.public_id,
        url: imageResult.secure_url
      };
    }

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating category'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(category.image.public_id);

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category'
    });
  }
};