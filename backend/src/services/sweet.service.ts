import { Database } from '../config/database';
import { z } from 'zod';

const createSweetSchema = z.object({
  name: z.string().min(1).max(255),
  category: z.string().min(1).max(100),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative(),
});

const updateSweetSchema = createSweetSchema.partial();

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export class SweetService {
  constructor(private db: Database) {}

  async createSweet(data: {
    name: string;
    category: string;
    price: number;
    quantity: number;
  }): Promise<Sweet> {
    createSweetSchema.parse(data);

    const result = await this.db.query(
      'INSERT INTO sweets (name, category, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.name, data.category, data.price, data.quantity]
    );

    return result.rows[0];
  }

  async getAllSweets(): Promise<Sweet[]> {
    const result = await this.db.query('SELECT * FROM sweets ORDER BY name');
    return result.rows;
  }

  async searchSweets(filters: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> {
    let query = 'SELECT * FROM sweets WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.name) {
      query += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${filters.name}%`);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.minPrice !== undefined) {
      query += ` AND price >= $${paramIndex}`;
      params.push(filters.minPrice);
      paramIndex++;
    }

    if (filters.maxPrice !== undefined) {
      query += ` AND price <= $${paramIndex}`;
      params.push(filters.maxPrice);
      paramIndex++;
    }

    query += ' ORDER BY name';

    const result = await this.db.query(query, params);
    return result.rows;
  }

  async getSweetById(id: number): Promise<Sweet | null> {
    const result = await this.db.query('SELECT * FROM sweets WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateSweet(id: number, data: Partial<Omit<Sweet, 'id' | 'created_at' | 'updated_at'>>): Promise<Sweet> {
    updateSweetSchema.parse(data);

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(data.name);
      paramIndex++;
    }

    if (data.category !== undefined) {
      updates.push(`category = $${paramIndex}`);
      params.push(data.category);
      paramIndex++;
    }

    if (data.price !== undefined) {
      updates.push(`price = $${paramIndex}`);
      params.push(data.price);
      paramIndex++;
    }

    if (data.quantity !== undefined) {
      updates.push(`quantity = $${paramIndex}`);
      params.push(data.quantity);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const result = await this.db.query(
      `UPDATE sweets SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      throw new Error('Sweet not found');
    }

    return result.rows[0];
  }

  async deleteSweet(id: number): Promise<void> {
    const result = await this.db.query('DELETE FROM sweets WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new Error('Sweet not found');
    }
  }

  async purchaseSweet(id: number, quantity: number): Promise<Sweet> {
    if (quantity <= 0) {
      throw new Error('Purchase quantity must be positive');
    }

    const sweet = await this.getSweetById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    if (sweet.quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    return this.updateSweet(id, {
      quantity: sweet.quantity - quantity,
    });
  }

  async restockSweet(id: number, quantity: number): Promise<Sweet> {
    if (quantity <= 0) {
      throw new Error('Restock quantity must be positive');
    }

    const sweet = await this.getSweetById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    return this.updateSweet(id, {
      quantity: sweet.quantity + quantity,
    });
  }
}

