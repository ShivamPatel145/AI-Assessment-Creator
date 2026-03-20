import { Assignment } from './assignment.model';
import { getQueue } from '../queue/queue';
import { getRedisClient } from '../../services/redisService';
import { CreateAssignmentInput } from './assignment.schema';
import { AppError } from '../../utils/AppError';
import logger from '../../utils/logger';

export const createAssignmentService = async (data: CreateAssignmentInput, userId: string) => {
  // Normalize questionsConfig: support both the new `questionsConfig` shape and
  // legacy/simple form fields like `questionTypes`, `numberOfQuestions`, `totalMarks`.
  let questionsConfig: any = (data as any).questionsConfig;
  if (!questionsConfig) {
    let qTypes = (data as any).questionTypes;
    const numQ = Number((data as any).numberOfQuestions) || 0;
    const totalMarks = Number((data as any).totalMarks) || 0;
    if (typeof qTypes === 'string') {
      try { qTypes = JSON.parse(qTypes); } catch { qTypes = [String(qTypes)]; }
    }

    if (Array.isArray(qTypes) && qTypes.length > 0 && numQ > 0) {
      // Distribute questions roughly evenly across selected types
      const base = Math.floor(numQ / qTypes.length);
      const remainder = numQ % qTypes.length;
      const marksPerQuestion = numQ ? Math.max(1, Math.floor(totalMarks / numQ)) : 1;
      questionsConfig = qTypes.map((t: any, i: number) => ({
        type: String(t),
        count: i === 0 ? base + remainder : base,
        marks: marksPerQuestion,
      }));
    } else {
      // Fallback: single short_answer bucket
      questionsConfig = [{ type: 'short_answer', count: numQ || 1, marks: Math.max(1, Math.floor((totalMarks || numQ) / (numQ || 1))) }];
    }
  }

  const assignment = new Assignment({
    ...data,
    questionsConfig,
    createdBy: userId,
    status: 'pending',
  });
  await assignment.save();

  const queue = getQueue();
  const job = await queue.add(
    'assignment-generation',
    { assignmentId: assignment._id.toString() },
    { jobId: `gen-${assignment._id}`, priority: 1 }
  );

  assignment.jobId = job.id;
  await assignment.save();

  logger.info({ assignmentId: assignment._id, jobId: job.id }, '[ASSIGNMENT CREATED]');
  return { jobId: job.id, assignmentId: assignment._id.toString() };
};

export const getAssignmentsService = async (userId: string) => {
  // Include `result` so frontend can render already-generated papers without extra fetches.
  // We still exclude heavy `fileUrl` if present.
  return Assignment.find({ createdBy: userId }).select('-fileUrl').sort({ createdAt: -1 });
};

export const getAssignmentByIdService = async (id: string) => {
  // Cache-first: check Redis before querying MongoDB
  try {
    const redis = getRedisClient();
    const cached = await redis.get(`assignment:${id}`);
    if (cached) {
      const assignment = await Assignment.findById(id).select('-fileUrl');
      if (assignment) {
        const obj = assignment.toObject();
        logger.info({ assignmentId: id, hasJobId: !!obj.jobId }, '[SERVICE] Returning cached assignment');
        return { ...obj, result: JSON.parse(cached) };
      }
    }
  } catch { /* cache miss — fallback to DB */ }

  const assignment = await Assignment.findById(id).select('-fileUrl');
  if (!assignment) throw new AppError('Assignment not found', 404);
  logger.info({ assignmentId: id, hasJobId: !!assignment.jobId, jobId: assignment.jobId }, '[SERVICE] Returning assignment from DB');
  return assignment;
};

export const getAssignmentStatusService = async (id: string) => {
  const assignment = await Assignment.findById(id).select('status');
  if (!assignment) throw new AppError('Assignment not found', 404);
  return assignment;
};

export const deleteAssignmentService = async (id: string, userId: string) => {
  const assignment = await Assignment.findOneAndDelete({ _id: id, createdBy: userId });
  if (!assignment) throw new AppError('Not found or unauthorized', 404);
  logger.info({ assignmentId: id }, '[ASSIGNMENT DELETED]');
  return assignment;
};

// ── Idempotency Guard ─────────────────────────────────────────────────
// Prevents duplicate jobs if user clicks "Generate" multiple times
export const regenerateAssignmentService = async (id: string, userId: string) => {
  const assignment = await Assignment.findOne({ _id: id, createdBy: userId });
  if (!assignment) throw new AppError('Not found or unauthorized', 404);

  // IDEMPOTENCY: reject if already processing
  if (assignment.status === 'processing') {
    throw new AppError('Assignment is already being processed. Please wait.', 409);
  }

  assignment.status = 'pending';
  assignment.result = undefined;

  const queue = getQueue();
  const job = await queue.add(
    'assignment-generation',
    { assignmentId: id },
    { jobId: `gen-${id}-${Date.now()}`, priority: 1 }
  );

  assignment.jobId = job.id;
  await assignment.save();

  logger.info({ assignmentId: id, jobId: job.id }, '[ASSIGNMENT REGENERATED]');
  return { jobId: job.id, assignmentId: assignment._id.toString() };
};
