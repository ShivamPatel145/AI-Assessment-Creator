import { Group, IGroup } from '../models/Group';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

// ── Types ─────────────────────────────────────────────────────────────
export interface CreateGroupData {
  title: string;
  students?: number;
  term: string;
  color?: string;
}

// ── Service Functions ─────────────────────────────────────────────────

export const getGroupsService = async (userId: string): Promise<IGroup[]> => {
  const groups = await Group.find({ user: userId }).sort({ createdAt: -1 });
  logger.info({ userId, count: groups.length }, '[GROUP] Fetched groups');
  return groups;
};

export const createGroupService = async (userId: string, data: CreateGroupData): Promise<IGroup> => {
  if (!data.title || !data.term) {
    throw new AppError('Title and term are required', 400);
  }

  const group = await Group.create({
    user: userId,
    title: data.title,
    students: data.students || 0,
    term: data.term,
    color: data.color || '#e0e7ff',
  });
  logger.info({ userId, groupId: group._id }, '[GROUP] Created group');
  return group;
};

export const getGroupByIdService = async (groupId: string, userId: string): Promise<IGroup> => {
  const group = await Group.findOne({ _id: groupId, user: userId });
  if (!group) throw new AppError('Group not found', 404);
  return group;
};

export const deleteGroupService = async (groupId: string, userId: string): Promise<IGroup> => {
  const group = await Group.findOneAndDelete({ _id: groupId, user: userId });
  if (!group) throw new AppError('Group not found or unauthorized', 404);
  logger.info({ userId, groupId }, '[GROUP] Deleted group');
  return group;
};
