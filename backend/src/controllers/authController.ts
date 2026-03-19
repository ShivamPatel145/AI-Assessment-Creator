import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { requireUser } from '../utils/requireUser';
import * as authService from '../services/auth.service';

// POST /auth/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, schoolName, location, role } = req.body;
    const userData = await authService.registerService({
      email, password, schoolName, location, role,
    });
    res.status(201).json(userData);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Server error registering user',
    });
  }
};

// POST /auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userData = await authService.loginService({ email, password });
    res.json(userData);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Server error logging in',
    });
  }
};

// GET /auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    const userData = await authService.getUserByIdService(user._id.toString());
    res.json(userData);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Server error',
    });
  }
};
