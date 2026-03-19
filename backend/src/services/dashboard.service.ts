import { Assignment } from '../modules/assignment/assignment.model';
import { Group } from '../models/Group';
import logger from '../utils/logger';

export interface DashboardStats {
  totalAssignments: number;
  activeStudents: number;
  avgCompletion: number;
  recentAssignments: Array<{
    _id: string;
    title: string;
    status: string;
    createdAt: string;
    dueDate: string;
  }>;
}

export const getDashboardStatsService = async (userId: string): Promise<DashboardStats> => {
  // Parallel queries for speed
  const [totalAssignments, completedCount, groups, recentAssignments] = await Promise.all([
    Assignment.countDocuments({ createdBy: userId }),
    Assignment.countDocuments({ createdBy: userId, status: 'completed' }),
    Group.find({ user: userId }),
    Assignment.find({ createdBy: userId })
      .select('title status createdAt dueDate')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const activeStudents = groups.reduce((acc, group) => acc + (group.students || 0), 0);
  const avgCompletion = totalAssignments > 0
    ? Math.round((completedCount / totalAssignments) * 100)
    : 0;

  logger.info({ userId, totalAssignments, activeStudents }, '[DASHBOARD] Stats fetched');

  return {
    totalAssignments,
    activeStudents,
    avgCompletion,
    recentAssignments: recentAssignments.map((a: any) => ({
      _id: a._id.toString(),
      title: a.title,
      status: a.status,
      createdAt: a.createdAt?.toISOString?.() || '',
      dueDate: a.dueDate?.toISOString?.() || '',
    })),
  };
};
