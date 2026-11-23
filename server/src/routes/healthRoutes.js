import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (request, response) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const databaseStatus = states[mongoose.connection.readyState] || 'unknown';
  const healthy = mongoose.connection.readyState === 1;

  response.status(healthy ? 200 : 503).json({
    success: healthy,
    message: healthy ? 'Portfolio API is healthy.' : 'Portfolio API is running but MongoDB is unavailable.',
    data: {
      service: 'portfolio-api',
      database: databaseStatus,
      timestamp: new Date().toISOString(),
      jwtConfigured: Boolean(process.env.JWT_SECRET),
    },
  });
});

export default router;
