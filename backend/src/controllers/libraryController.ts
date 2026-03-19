import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { requireUser } from '../utils/requireUser';
import * as libraryService from '../services/library.service';

// GET /library
export const getFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    const files = await libraryService.getFilesService(user._id.toString());
    res.json(files);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch library files',
    });
  }
};

// POST /library
export const addFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    const { name, type, folder } = req.body;
    const file = await libraryService.addFileService(user._id.toString(), {
      name, type, folder,
    });
    res.status(201).json(file);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to add library file',
    });
  }
};

// DELETE /library/:id
export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    await libraryService.deleteFileService(req.params.id as string, user._id.toString());
    res.json({ message: 'File deleted' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete file',
    });
  }
};
