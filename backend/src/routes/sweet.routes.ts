import { Router } from 'express';
import { SweetController } from '../controllers/sweet.controller';
import { SweetService } from '../services/sweet.service';
import { Database } from '../config/database';
import { authenticateToken, requireAdmin } from '../middleware/auth';

export function createSweetRoutes(db: Database): Router {
  const router = Router();
  const sweetService = new SweetService(db);
  const sweetController = new SweetController(sweetService);

  // All sweet routes require authentication
  router.use(authenticateToken);

  router.post('/', (req, res) => sweetController.createSweet(req, res));
  router.get('/', (req, res) => sweetController.getAllSweets(req, res));
  router.get('/search', (req, res) => sweetController.searchSweets(req, res));
  router.put('/:id', (req, res) => sweetController.updateSweet(req, res));
  router.delete('/:id', requireAdmin, (req, res) => sweetController.deleteSweet(req, res));
  router.post('/:id/purchase', (req, res) => sweetController.purchaseSweet(req, res));
  router.post('/:id/restock', requireAdmin, (req, res) => sweetController.restockSweet(req, res));

  return router;
}

