import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables FIRST before importing anything that needs env vars
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

import sequelize, { testConnection, models } from './config/database.js';
import logger from './config/logger.js';
import { corsMiddleware } from './middleware/cors.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// ==================== App Configuration ====================
// Store models in app.locals for controller access
app.locals.models = models;

// ==================== Middleware ====================

// Trust Proxy (for Nginx reverse proxy with X-Forwarded-For header)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());

// CORS Middleware
app.use(corsMiddleware);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ==================== Routes ====================
app.use('/api', routes);

// ==================== Error Handling ====================
app.use(errorHandler);

// ==================== Server Startup ====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection (non-blocking in development)
    let dbConnected = false;
    try {
      dbConnected = await testConnection();
      
      // Sync database (development only)
      if (process.env.NODE_ENV === 'development' && dbConnected) {
        await sequelize.sync({ alter: false });
        logger.info('Database models synchronized.');
      }
    } catch (dbError) {
      logger.warn(`⚠️  Database error: ${dbError.message}`);
      logger.info('ℹ️  Continuing without database - please configure MySQL and restart');
    }

    // Start server regardless of database status
    app.listen(PORT, () => {
      logger.info(`✅ Server running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
      if (!dbConnected) {
        logger.info('⚠️  Database not connected - API will return 503 Service Unavailable for operations requiring DB');
      }
    });
  } catch (error) {
    logger.error(`❌ Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

startServer();

export default app;
