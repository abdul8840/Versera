import express from 'express';
import { body } from 'express-validator';
import {
  createComment,
  getStoryComments,
  updateComment,
  deleteComment,
  toggleCommentLike
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/stories/:storyId/comments', getStoryComments);

// Protected routes
router.post('/stories/:storyId/comments', [
  protect,
  body('content').notEmpty().withMessage('Comment content is required')
], createComment);

router.put('/:id', [
  protect,
  body('content').notEmpty().withMessage('Comment content is required')
], updateComment);

router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleCommentLike);

export default router;