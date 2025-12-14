import request from 'supertest';
import express from 'express';
import { createAuthRoutes } from '../routes/auth.routes';
import { Database } from '../config/database';

// Mock database
class MockDatabase implements Database {
  private users: any[] = [];
  private idCounter = 1;

  async query(text: string, params?: any[]): Promise<any> {
    if (text.includes('SELECT') && text.includes('users')) {
      return {
        rows: this.users.filter((u: any) => {
          if (text.includes('email = $1')) return u.email === params?.[0];
          if (text.includes('username = $2')) return u.username === params?.[1];
          return false;
        }),
      };
    }
    if (text.includes('INSERT INTO users')) {
      const user = {
        id: this.idCounter++,
        username: params?.[0],
        email: params?.[1],
        password: params?.[2],
        role: params?.[3] || 'user',
      };
      this.users.push(user);
      return { rows: [user] };
    }
    return { rows: [] };
  }

  async close(): Promise<void> {
    // Mock
  }
}

describe('Auth Controller', () => {
  let app: express.Application;
  let mockDb: Database;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    mockDb = new MockDatabase();
    app.use('/api/auth', createAuthRoutes(mockDb));
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First register
      await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      // Then login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });
});

