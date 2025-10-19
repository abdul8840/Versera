import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected
router.use(protect);

// User profile routes will be added here

export default router;