import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { Database } from '../config/database';

export function createAuthRoutes(db: Database): Router {
  const router = Router();
  const authService = new AuthService(db);
  const authController = new AuthController(authService);

  router.post('/register', (req, res) => authController.register(req, res));
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
}

