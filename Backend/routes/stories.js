import express from 'express';
import { body } from 'express-validator';
import {
  createStory,
  getStories,
  getStory,
  updateStory,
  deleteStory,
  getWriterStories,
  toggleLike
} from '../controllers/storyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import Story from '../models/Story.js';

const router = express.Router();

// Public routes
router.get('/', getStories);
router.get('/:id', getStory);

// Protected routes
router.post('/:id/like', protect, toggleLike);

// Writer routes
router.get('/writer/stories', [
  protect,
  authorize('writer')
], getWriterStories);

router.post('/writer/stories', [
  protect,
  authorize('writer'),
  body('title').notEmpty().withMessage('Story title is required'),
  body('description').notEmpty().withMessage('Story description is required'),
  body('content').notEmpty().withMessage('Story content is required'),

  // --- FIX IS HERE ---
  body('categories')
    .custom((value) => {
      try {
        const parsedArray = JSON.parse(value);
        if (!Array.isArray(parsedArray) || parsedArray.length < 1) {
          throw new Error('At least one category is required.');
        }
      } catch (error) {
        throw new Error('Categories must be a valid JSON array string.');
      }
      return true;
    }),
  // --- END OF FIX ---

  body('targetAudience').notEmpty().withMessage('Target audience is required'),
  body('language').notEmpty().withMessage('Language is required')
], createStory);

router.put('/writer/stories/:id', [
  protect,
  authorize('writer'),
  body('title').optional().notEmpty().withMessage('Story title is required'),
  body('description').optional().notEmpty().withMessage('Story description is required'),
  body('content').optional().notEmpty().withMessage('Story content is required')
], updateStory);

router.delete('/writer/stories/:id', [
  protect,
  authorize('writer')
], deleteStory);

// Add this route to your story routes file
router.post('/:id/view', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Increment views by 1
    story.views += 1;
    await story.save();

    res.json({
      success: true,
      message: 'View count updated',
      story: {
        _id: story._id,
        views: story.views
      }
    });

  } catch (error) {
    console.error('Increment view error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating view count'
    });
  }
});

export default router;