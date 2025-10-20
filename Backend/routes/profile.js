// routes/profile.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadCover,
  getMyProfile
} from '../controllers/profileController.js';

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.get('/:userId', getProfile);
router.put('/update', protect, updateProfile);
router.put('/upload-avatar', protect, uploadAvatar);
router.put('/upload-cover', protect, uploadCover);

export default router;