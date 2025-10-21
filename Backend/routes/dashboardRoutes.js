import express from 'express';
import { getReaderDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getReaderDashboard);

export default router;