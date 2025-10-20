import express from 'express';
import { adminDeleteStory, getAdminStories } from '../controllers/storyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAdminStories);
router.delete('/:id', protect, authorize('admin'), adminDeleteStory);

export default router;