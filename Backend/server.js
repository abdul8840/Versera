// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';
import writerRoutes from './routes/writer.js';
import profileRoutes from './routes/profile.js';

import categoryRoutes from './routes/categories.js';
import targetAudienceRoutes from './routes/targetAudiences.js';
import storyRoutes from './routes/stories.js';
import commentRoutes from './routes/comments.js';
import adminStoryRoutes from './routes/adminStories.js';

import adminCategoriesRoutes from './routes/adminCategories.js';
import adminTargetAudiencesRoutes from './routes/adminTargetAudiences.js';

import fileUpload from 'express-fileupload';

dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
}));

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL, // Client frontend
    process.env.ADMIN_URL, // Admin frontend
  ],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/writer', writerRoutes);
app.use('/api/profile', profileRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/api/target-audiences', targetAudienceRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin/stories', adminStoryRoutes);

app.use('/api/admin/categories', adminCategoriesRoutes);
app.use('/api/admin/target-audiences', adminTargetAudiencesRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.log('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});