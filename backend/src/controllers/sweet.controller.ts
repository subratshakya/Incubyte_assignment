import { Request, Response } from 'express';
import { SweetService } from '../services/sweet.service';

export class SweetController {
  constructor(private sweetService: SweetService) {}

  async createSweet(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, price, quantity } = req.body;

      if (!name || !category || price === undefined || quantity === undefined) {
        res.status(400).json({ error: 'Name, category, price, and quantity are required' });
        return;
      }

      const sweet = await this.sweetService.createSweet({
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      });

      res.status(201).json(sweet);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllSweets(req: Request, res: Response): Promise<void> {
    try {
      const sweets = await this.sweetService.getAllSweets();
      res.json(sweets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchSweets(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, minPrice, maxPrice } = req.query;

      const filters: any = {};
      if (name) filters.name = name as string;
      if (category) filters.category = category as string;
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);

      const sweets = await this.sweetService.searchSweets(filters);
      res.json(sweets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateSweet(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;

      if (updates.price !== undefined) {
        updates.price = parseFloat(updates.price);
      }
      if (updates.quantity !== undefined) {
        updates.quantity = parseInt(updates.quantity);
      }

      const sweet = await this.sweetService.updateSweet(id, updates);
      res.json(sweet);
    } catch (error: any) {
      if (error.message === 'Sweet not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async deleteSweet(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.sweetService.deleteSweet(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Sweet not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async purchaseSweet(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({ error: 'Valid quantity is required' });
        return;
      }

      const sweet = await this.sweetService.purchaseSweet(id, parseInt(quantity));
      res.json(sweet);
    } catch (error: any) {
      if (error.message === 'Sweet not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async restockSweet(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({ error: 'Valid quantity is required' });
        return;
      }

      const sweet = await this.sweetService.restockSweet(id, parseInt(quantity));
      res.json(sweet);
    } catch (error: any) {
      if (error.message === 'Sweet not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}

