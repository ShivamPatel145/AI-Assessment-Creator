import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { requireUser } from '../utils/requireUser';
import * as groupService from '../services/group.service';

// GET /groups
export const getGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    const groups = await groupService.getGroupsService(user._id.toString());
    res.json(groups);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch groups',
    });
  }
};

// POST /groups
export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    const { title, students, term, color } = req.body;
    const group = await groupService.createGroupService(user._id.toString(), {
      title, students, term, color,
    });
    res.status(201).json(group);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to create group',
    });
  }
};

// GET /groups/:id
export const getGroupById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    const group = await groupService.getGroupByIdService(req.params.id as string, user._id.toString());
    res.json(group);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch group',
    });
  }
};

// DELETE /groups/:id
export const deleteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    await groupService.deleteGroupService(req.params.id as string, user._id.toString());
    res.json({ message: 'Group deleted' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete group',
    });
  }
};
