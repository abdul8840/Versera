import express from 'express';
import { toggleStoryInList, getMyList } from '../controllers/myListController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Both routes are protected and require a logged-in user
router.route('/')
  .get(protect, getMyList);

router.route('/:storyId')
  .post(protect, toggleStoryInList);

export default router;