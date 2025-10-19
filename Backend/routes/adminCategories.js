import express from 'express';
import { body } from 'express-validator';
import {
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and only for admin
router.use(protect);
router.use(authorize('admin'));

// @desc    Create category
// @route   POST /api/admin/categories
router.post('/', [
  body('name').notEmpty().withMessage('Category name is required'),
  body('description').notEmpty().withMessage('Category description is required')
], createCategory);

// @desc    Update category
// @route   PUT /api/admin/categories/:id
router.put('/:id', [
  body('name').optional().notEmpty().withMessage('Category name is required'),
  body('description').optional().notEmpty().withMessage('Category description is required')
], updateCategory);

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
router.delete('/:id', deleteCategory);

export default router;