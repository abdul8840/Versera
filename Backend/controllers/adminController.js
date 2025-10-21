import { validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists and is admin
    const admin = await User.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check if user is admin
    if (admin.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized as admin'
      });
    }

    // Check if admin is verified
    if (!admin.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not verified'
      });
    }

    const isPasswordMatch = await admin.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during admin login'
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    
    res.json({
      success: true,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin profile'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const search = req.query.search;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      count: users.length,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
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
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { firstName, lastName, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        role,
        isActive
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own admin account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWriters = await User.countDocuments({ role: 'writer' });
    const totalReaders = await User.countDocuments({ role: 'reader' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get total stories (you'll need to import Story model)
    // const totalStories = await Story.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalWriters,
        totalReaders,
        totalAdmins,
        recentUsers,
        totalStories: 0, // Placeholder - implement when Story model is available
        totalComments: 0 // Placeholder
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};