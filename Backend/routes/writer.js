import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected and only for writers
router.use(protect);
router.use(authorize('writer'));

// Writer routes will be added here

export default router;