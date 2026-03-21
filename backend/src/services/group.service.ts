import { Group, IGroup } from '../models/Group';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

// ── Types ─────────────────────────────────────────────────────────────
export interface CreateGroupData {
  title: string;
  students?: number;
  term: string;
  color?: string;
  roster?: Array<{ name: string; rollNo?: string }>;
}

export interface UpdateGroupData {
  title?: string;
  students?: number;
  term?: string;
  color?: string;
  roster?: Array<{ name: string; rollNo?: string }>;
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
    roster: Array.isArray(data.roster) ? data.roster : [],
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

export const updateGroupService = async (groupId: string, userId: string, data: UpdateGroupData): Promise<IGroup> => {
  const group = await Group.findOne({ _id: groupId, user: userId });
  if (!group) throw new AppError('Group not found or unauthorized', 404);

  if (typeof data.title === 'string' && data.title.trim()) {
    group.title = data.title.trim();
  }
  if (typeof data.term === 'string' && data.term.trim()) {
    group.term = data.term.trim();
  }
  if (typeof data.students === 'number' && data.students >= 0) {
    group.students = data.students;
  }
  if (typeof data.color === 'string' && data.color.trim()) {
    group.color = data.color;
  }
  if (Array.isArray(data.roster)) {
    group.roster = data.roster
      .filter((r) => typeof r?.name === 'string' && r.name.trim())
      .map((r) => ({ name: r.name.trim(), rollNo: r.rollNo?.trim() || '' }));
    group.students = group.roster.length;
  }

  await group.save();
  logger.info({ userId, groupId }, '[GROUP] Updated group');
  return group;
};
