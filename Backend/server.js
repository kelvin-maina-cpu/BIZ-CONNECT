const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const socketHandler = require('./socket/socketHandler');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const gigRoutes = require('./routes/gigs');
const applicationRoutes = require('./routes/applications');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');

dotenv.config();
connectDB();

const app = express();
let httpServer = null;
let io = null;

const createServerInstance = () => {
  if (httpServer) {
    try {
      httpServer.close();
    } catch (err) {
      // ignore if already closed
    }
  }

  httpServer = createServer(app);
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Reattach socket handlers
  socketHandler(io);
};

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Development helper: seed database (POST /api/seed)
app.post('/api/seed', async (req, res) => {
  try {
    const seedDatabase = require('./utils/seedData');
    await seedDatabase();
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = (port) => {
  createServerInstance();

  const server = httpServer.listen(port);

  server.on('listening', () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`📡 API URL: http://localhost:${port}/api`);
    console.log('🔌 Socket.IO ready');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${port} is busy, trying ${port + 1}...`);
      server.close(() => {
        startServer(port + 1);
      });
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });

  const shutdown = () => {
    console.log('👋 SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('💤 Process terminated');
      mongoose.connection.close(false, () => {
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer(PORT);
