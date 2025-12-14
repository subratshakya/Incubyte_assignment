import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { createAuthRoutes } from '../routes/auth.routes';
import { createSweetRoutes } from '../routes/sweet.routes';
import { Database } from '../config/database';

// Mock database for integration tests
class TestDatabase implements Database {
  private users: any[] = [];
  private sweets: any[] = [];
  private userIdCounter = 1;
  private sweetIdCounter = 1;

  async query(text: string, params?: any[]): Promise<any> {
    // User queries
    if (text.includes('SELECT') && text.includes('users')) {
      if (text.includes('email = $1')) {
        return { rows: this.users.filter(u => u.email === params?.[0]) };
      }
      if (text.includes('username = $2') || text.includes('email = $1 OR username = $2')) {
        return { rows: this.users.filter(u => u.email === params?.[0] || u.username === params?.[1]) };
      }
    }
    if (text.includes('INSERT INTO users')) {
      const user = {
        id: this.userIdCounter++,
        username: params?.[0],
        email: params?.[1],
        password: params?.[2],
        role: params?.[3] || 'user',
        created_at: new Date().toISOString(),
      };
      this.users.push(user);
      return { rows: [{ ...user, password: undefined }] };
    }

    // Sweet queries
    if (text.includes('INSERT INTO sweets')) {
      const sweet = {
        id: this.sweetIdCounter++,
        name: params?.[0],
        category: params?.[1],
        price: params?.[2],
        quantity: params?.[3],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.sweets.push(sweet);
      return { rows: [sweet] };
    }
    if (text.includes('SELECT * FROM sweets')) {
      if (text.includes('WHERE id = $1')) {
        return { rows: this.sweets.filter(s => s.id === params?.[0]) };
      }
      if (text.includes('ILIKE') || text.includes('category =')) {
        // Simple search mock
        return { rows: [...this.sweets] };
      }
      return { rows: [...this.sweets] };
    }
    if (text.includes('UPDATE sweets')) {
      const id = params?.[params.length - 1];
      const index = this.sweets.findIndex(s => s.id === id);
      if (index !== -1) {
        Object.assign(this.sweets[index], {
          name: params?.[0],
          category: params?.[1],
          price: params?.[2],
          quantity: params?.[3],
          updated_at: new Date().toISOString(),
        });
        return { rows: [this.sweets[index]] };
      }
      return { rows: [] };
    }
    if (text.includes('DELETE FROM sweets')) {
      const id = params?.[0];
      const index = this.sweets.findIndex(s => s.id === id);
      if (index !== -1) {
        this.sweets.splice(index, 1);
        return { rowCount: 1 };
      }
      return { rowCount: 0 };
    }

    return { rows: [] };
  }

  async close(): Promise<void> {
    // Mock
  }
}

// Mock auth middleware
jest.mock('../middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: 1, username: 'testuser', email: 'test@test.com', role: 'user' };
    next();
  },
  requireAdmin: (req: any, res: any, next: any) => {
    if (req.user?.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  },
}));

describe('Integration Tests', () => {
  let app: express.Application;
  let testDb: Database;
  let authToken: string;

  beforeEach(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    testDb = new TestDatabase();
    app.use('/api/auth', createAuthRoutes(testDb));
    app.use('/api/sweets', createSweetRoutes(testDb));
  });

  describe('Complete User Flow', () => {
    it('should allow user to register, login, and access sweets', async () => {
      // Register
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'integrationtest',
          email: 'integration@test.com',
          password: 'password123',
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.user).toBeDefined();
      expect(registerResponse.body.token).toBeDefined();

      authToken = registerResponse.body.token;

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration@test.com',
          password: 'password123',
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeDefined();

      // Get sweets (should work with token)
      const sweetsResponse = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(sweetsResponse.status).toBe(200);
      expect(Array.isArray(sweetsResponse.body)).toBe(true);
    });
  });

  describe('Sweet Management Flow', () => {
    beforeEach(() => {
      // Mock admin user
      jest.spyOn(require('../middleware/auth'), 'authenticateToken').mockImplementation(
        (req: any, res: any, next: any) => {
          req.user = { id: 1, username: 'admin', email: 'admin@test.com', role: 'admin' };
          next();
        }
      );
    });

    it('should allow admin to create, update, and delete sweets', async () => {
      // Create sweet
      const createResponse = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Integration Test Sweet',
          category: 'Test',
          price: 5.99,
          quantity: 50,
        });

      expect(createResponse.status).toBe(201);
      const sweetId = createResponse.body.id;

      // Update sweet
      const updateResponse = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .send({
          price: 6.99,
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.price).toBe(6.99);

      // Delete sweet
      const deleteResponse = await request(app)
        .delete(`/api/sweets/${sweetId}`);

      expect(deleteResponse.status).toBe(204);
    });
  });
});

