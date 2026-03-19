import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { requireUser } from '../utils/requireUser';
import { getDashboardStatsService } from '../services/dashboard.service';

// GET /dashboard
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    const stats = await getDashboardStatsService(user._id.toString());
    res.json(stats);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch dashboard stats',
    });
  }
};
