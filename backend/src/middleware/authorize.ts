import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User is not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden access. Role '${req.user.role}' is not authorized for this resource. Required role(s): ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};
