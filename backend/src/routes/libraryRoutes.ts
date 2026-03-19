import express from 'express';
import { getFiles, addFile, deleteFile } from '../controllers/libraryController';
import { protect, authorizeRoles, Role } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getFiles)
  .post(protect, authorizeRoles(Role.TEACHER), addFile);

router.route('/:id')
  .delete(protect, authorizeRoles(Role.TEACHER), deleteFile);

export default router;
