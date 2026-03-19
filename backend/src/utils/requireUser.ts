import { AuthRequest } from '../middleware/authMiddleware';
import { IUser } from '../models/User';
import { AppError } from './AppError';

/**
 * Safely extracts the authenticated user from an AuthRequest.
 * Throws AppError(401) if user is missing — eliminates all `req.user!` usage.
 *
 * Usage:
 *   const user = requireUser(req);
 *   const userId = user._id.toString();
 */
export function requireUser(req: AuthRequest): IUser {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  return req.user;
}
