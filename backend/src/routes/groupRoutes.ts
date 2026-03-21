import express from 'express';
import { getGroups, createGroup, getGroupById, deleteGroup, updateGroup } from '../controllers/groupController';
import { protect, authorizeRoles, Role } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getGroups)
  .post(protect, authorizeRoles(Role.TEACHER), createGroup);

router.route('/:id')
  .get(protect, getGroupById)
  .put(protect, authorizeRoles(Role.TEACHER), updateGroup)
  .delete(protect, authorizeRoles(Role.TEACHER), deleteGroup);

export default router;
