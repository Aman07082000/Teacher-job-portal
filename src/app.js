import express from 'express';
import cors from 'cors';
import compression from 'compression';
import authRoutes from './routes/auth.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import schoolRoutes from './routes/school.routes.js';
import adminRoutes from './routes/admin.routes.js';
import jobRoutes from './routes/job.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

// Enable compression for responses
app.use(compression());

// CORS with options
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Parse JSON with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Teacher Job Portal API is running.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
