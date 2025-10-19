import express from 'express';
import { body } from 'express-validator';
import {
  adminLogin,
  getAdminProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Admin login
// @route   POST /api/admin/login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], adminLogin);

// All routes below are protected and only for admin
router.use(protect);
router.use(authorize('admin'));

// @desc    Get admin profile
// @route   GET /api/admin/profile
router.get('/profile', getAdminProfile);

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
router.get('/stats', getDashboardStats);

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', getUsers);

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
router.get('/users/:id', getUserById);

// @desc    Update user
// @route   PUT /api/admin/users/:id
router.put('/users/:id', [
  body('firstName').optional().notEmpty().withMessage('First name is required'),
  body('lastName').optional().notEmpty().withMessage('Last name is required'),
  body('role').optional().isIn(['reader', 'writer', 'admin']).withMessage('Role must be reader, writer, or admin')
], updateUser);

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

export default router;