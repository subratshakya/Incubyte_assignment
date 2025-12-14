import request from 'supertest';
import express from 'express';
import { createSweetRoutes } from '../routes/sweet.routes';
import { Database } from '../config/database';
import { authenticateToken } from '../middleware/auth';

// Mock database
class MockDatabase implements Database {
  private sweets: any[] = [];
  private idCounter = 1;

  async query(text: string, params?: any[]): Promise<any> {
    if (text.includes('INSERT INTO sweets')) {
      const sweet = {
        id: this.idCounter++,
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
        return { rows: this.sweets.filter((s) => s.id === params?.[0]) };
      }
      return { rows: [...this.sweets] };
    }
    if (text.includes('UPDATE sweets')) {
      const id = params?.[params.length - 1];
      const index = this.sweets.findIndex((s) => s.id === id);
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
      const index = this.sweets.findIndex((s) => s.id === id);
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
    req.user = { id: 1, username: 'test', email: 'test@test.com', role: 'user' };
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

describe('Sweet Controller', () => {
  let app: express.Application;
  let mockDb: Database;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    mockDb = new MockDatabase();
    app.use('/api/sweets', createSweetRoutes(mockDb));
  });

  describe('GET /api/sweets', () => {
    it('should return all sweets', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Test Sweet',
          category: 'Test',
          price: 2.50,
          quantity: 100,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Sweet');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Test Sweet',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase a sweet', async () => {
      // First create a sweet
      const createResponse = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Test Sweet',
          category: 'Test',
          price: 2.50,
          quantity: 100,
        });

      const sweetId = createResponse.body.id;

      // Then purchase
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 10 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(90);
    });
  });
});

