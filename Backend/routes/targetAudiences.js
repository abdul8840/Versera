import express from 'express';
import { body } from 'express-validator';
import {
  createTargetAudience,
  getTargetAudiences,
  updateTargetAudience,
  deleteTargetAudience
} from '../controllers/targetAudienceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getTargetAudiences);

// Admin routes
router.post('/', [
  protect,
  authorize('admin'),
  body('title').notEmpty().withMessage('Target audience title is required'),
  body('description').notEmpty().withMessage('Target audience description is required'),
  body('minAge').isInt({ min: 1 }).withMessage('Minimum age must be a positive number')
], createTargetAudience);

router.put('/:id', [
  protect,
  authorize('admin'),
  body('title').optional().notEmpty().withMessage('Target audience title is required'),
  body('description').optional().notEmpty().withMessage('Target audience description is required'),
  body('minAge').optional().isInt({ min: 1 }).withMessage('Minimum age must be a positive number')
], updateTargetAudience);

router.delete('/:id', [
  protect,
  authorize('admin')
], deleteTargetAudience);

export default router;