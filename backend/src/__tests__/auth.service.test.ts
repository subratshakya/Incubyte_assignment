import { AuthService } from '../services/auth.service';
import { Database } from '../config/database';

// Mock database
class MockDatabase implements Database {
  private data: any[] = [];

  async query(text: string, params?: any[]): Promise<any> {
    if (text.includes('SELECT')) {
      return { rows: this.data.filter((row: any) => {
        if (text.includes('email = $1')) {
          return row.email === params?.[0];
        }
        if (text.includes('username = $2')) {
          return row.username === params?.[1];
        }
        return false;
      }) };
    }
    if (text.includes('INSERT')) {
      const newRow = {
        id: this.data.length + 1,
        username: params?.[0],
        email: params?.[1],
        password: params?.[2],
        role: params?.[3] || 'user',
      };
      this.data.push(newRow);
      return { rows: [newRow] };
    }
    return { rows: [] };
  }

  async close(): Promise<void> {
    // Mock close
  }
}

describe('AuthService', () => {
  let authService: AuthService;
  let mockDb: Database;

  beforeEach(() => {
    mockDb = new MockDatabase();
    authService = new AuthService(mockDb);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const result = await authService.register('testuser', 'test@example.com', 'password123');
      
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
    });

    it('should throw error if user already exists', async () => {
      await authService.register('testuser', 'test@example.com', 'password123');
      
      await expect(
        authService.register('testuser', 'test@example.com', 'password123')
      ).rejects.toThrow('User with this email or username already exists');
    });

    it('should validate input', async () => {
      await expect(
        authService.register('ab', 'invalid-email', '123')
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      await authService.register('testuser', 'test@example.com', 'password123');
      
      const result = await authService.login('test@example.com', 'password123');
      
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should throw error with incorrect password', async () => {
      await authService.register('testuser', 'test@example.com', 'password123');
      
      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error with non-existent email', async () => {
      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid email or password');
    });
  });
});

