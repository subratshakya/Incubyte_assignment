import { SweetService } from '../services/sweet.service';
import { Database } from '../config/database';

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
        return { rows: this.sweets.filter(s => s.id === params?.[0]) };
      }
      return { rows: [...this.sweets] };
    }
    
    if (text.includes('UPDATE sweets')) {
      const id = params?.[params.length - 1];
      const sweetIndex = this.sweets.findIndex(s => s.id === id);
      if (sweetIndex !== -1) {
        Object.assign(this.sweets[sweetIndex], {
          name: params?.[0],
          category: params?.[1],
          price: params?.[2],
          quantity: params?.[3],
          updated_at: new Date().toISOString(),
        });
        return { rows: [this.sweets[sweetIndex]] };
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
    // Mock close
  }
}

describe('SweetService', () => {
  let sweetService: SweetService;
  let mockDb: Database;

  beforeEach(() => {
    mockDb = new MockDatabase();
    sweetService = new SweetService(mockDb);
  });

  describe('createSweet', () => {
    it('should create a new sweet', async () => {
      const sweet = await sweetService.createSweet({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100,
      });

      expect(sweet.name).toBe('Chocolate Bar');
      expect(sweet.category).toBe('Chocolate');
      expect(sweet.price).toBe(2.50);
      expect(sweet.quantity).toBe(100);
    });

    it('should validate input', async () => {
      await expect(
        sweetService.createSweet({
          name: '',
          category: 'Chocolate',
          price: -1,
          quantity: -1,
        })
      ).rejects.toThrow();
    });
  });

  describe('getAllSweets', () => {
    it('should return all sweets', async () => {
      await sweetService.createSweet({
        name: 'Sweet 1',
        category: 'Category 1',
        price: 1.0,
        quantity: 10,
      });

      const sweets = await sweetService.getAllSweets();
      expect(sweets.length).toBeGreaterThan(0);
    });
  });

  describe('purchaseSweet', () => {
    it('should decrease quantity when purchasing', async () => {
      const sweet = await sweetService.createSweet({
        name: 'Test Sweet',
        category: 'Test',
        price: 1.0,
        quantity: 100,
      });

      const updated = await sweetService.purchaseSweet(sweet.id, 10);
      expect(updated.quantity).toBe(90);
    });

    it('should throw error if insufficient stock', async () => {
      const sweet = await sweetService.createSweet({
        name: 'Test Sweet',
        category: 'Test',
        price: 1.0,
        quantity: 5,
      });

      await expect(
        sweetService.purchaseSweet(sweet.id, 10)
      ).rejects.toThrow('Insufficient stock');
    });
  });

  describe('restockSweet', () => {
    it('should increase quantity when restocking', async () => {
      const sweet = await sweetService.createSweet({
        name: 'Test Sweet',
        category: 'Test',
        price: 1.0,
        quantity: 100,
      });

      const updated = await sweetService.restockSweet(sweet.id, 50);
      expect(updated.quantity).toBe(150);
    });
  });
});

