import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import connectDB from './config/db.js';
import diagnoseRoutes from './routes/diagnose.js';
import aiDiagnoseRoutes from './routes/aiDiagnose.js';
import mechanicsRoutes from './routes/mechanics.js';
import towingRoutes from './routes/towing.js';
import authRoutes from './routes/auth.js';
import partsRoutes from './routes/parts.js';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import diagnosisRoutes from './routes/diagnosisRoutes.js';

dotenv.config();

// Debug environment variables
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY ? 'Set' : 'Not Set'
});

const app = express();

// Logging middleware
app.use(morgan('dev'));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Basic middleware
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS configuration
app.use(cors());

// Database connection with retry mechanism
const connectWithRetry = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Routes
app.use('/api', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.path}`);
  next();
});

app.use('/api/diagnose', diagnoseRoutes);
app.use('/api/ai-diagnose', aiDiagnoseRoutes);
app.use('/api/mechanics', mechanicsRoutes);
app.use('/api/towing', towingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/diagnosis', diagnosisRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start server with error handling
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.log('Port is busy, retrying with different port...');
    setTimeout(() => {
      server.close();
      server.listen(PORT + 1);
    }, 1000);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, just log the error
});

// Connect to database
connectWithRetry();
