import express from 'express';
import { body } from 'express-validator';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);

// Admin routes
router.post('/', [
  protect,
  authorize('admin'),
  body('name').notEmpty().withMessage('Category name is required'),
  body('description').notEmpty().withMessage('Category description is required')
], createCategory);

router.put('/:id', [
  protect,
  authorize('admin'),
  body('name').optional().notEmpty().withMessage('Category name is required'),
  body('description').optional().notEmpty().withMessage('Category description is required')
], updateCategory);

router.delete('/:id', [
  protect,
  authorize('admin')
], deleteCategory);

export default router;