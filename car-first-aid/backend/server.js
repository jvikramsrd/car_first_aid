import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import diagnoseRoutes from './routes/diagnose.js';
import aiDiagnoseRoutes from './routes/aiDiagnoseSimple.js';
import mechanicsRoutes from './routes/mechanics.js';
import towingRoutes from './routes/towing.js';
import authRoutes from './routes/auth.js';
import partsRoutes from './routes/parts.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/diagnose', diagnoseRoutes);
app.use('/api/ai-diagnose', aiDiagnoseRoutes);
app.use('/api/mechanics', mechanicsRoutes);
app.use('/api/towing', towingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);

// Database connection
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
