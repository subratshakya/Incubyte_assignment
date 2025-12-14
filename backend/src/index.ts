import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { createAuthRoutes } from './routes/auth.routes';
import { createSweetRoutes } from './routes/sweet.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database and routes
let db: any;

async function startServer() {
  try {
    db = await initializeDatabase();
    console.log('Database initialized successfully');

    // Routes
    app.use('/api/auth', createAuthRoutes(db));
    app.use('/api/sweets', createSweetRoutes(db));

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Sweet Shop API is running' });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (db) {
    await db.close();
  }
  process.exit(0);
});

