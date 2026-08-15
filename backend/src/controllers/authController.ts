import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../middleware/authenticate';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, phone, date_of_birth } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required fields.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters in length.' });
      }

      const result = await AuthService.registerPatient({
        name,
        email,
        password,
        phone,
        date_of_birth,
      });

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const result = await AuthService.login({ email, password });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }

      const user = await AuthService.getCurrentUser(req.user.userId);
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response) {
    // Stateless JWT approach clear response
    return res.status(200).json({
      message: 'Logout successful. Client token should be removed from client storage.',
    });
  }
}
