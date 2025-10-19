import express from 'express';
import { body } from 'express-validator';
import {
  createTargetAudience,
  updateTargetAudience,
  deleteTargetAudience
} from '../controllers/targetAudienceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and only for admin
router.use(protect);
router.use(authorize('admin'));

// @desc    Create target audience
// @route   POST /api/admin/target-audiences
router.post('/', [
  body('title').notEmpty().withMessage('Target audience title is required'),
  body('description').notEmpty().withMessage('Target audience description is required'),
  body('minAge').isInt({ min: 1 }).withMessage('Minimum age must be a positive number')
], createTargetAudience);

// @desc    Update target audience
// @route   PUT /api/admin/target-audiences/:id
router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Target audience title is required'),
  body('description').optional().notEmpty().withMessage('Target audience description is required'),
  body('minAge').optional().isInt({ min: 1 }).withMessage('Minimum age must be a positive number')
], updateTargetAudience);

// @desc    Delete target audience
// @route   DELETE /api/admin/target-audiences/:id
router.delete('/:id', deleteTargetAudience);

export default router;