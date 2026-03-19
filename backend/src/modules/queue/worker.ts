import { Worker, Job } from 'bullmq';
import { getRedisConnection, setJobState } from '../../services/redisService';
import { GenerationJobData } from './queue';
import { generateQuestionPaper } from '../ai/ai.service';
import { Assignment } from '../assignment/assignment.model';
import { emitProgress, emitCompleted, emitError } from '../../websocket';
import logger from '../../utils/logger';

let worker: Worker | null = null;

export const startWorker = (): Worker => {
  const connection = getRedisConnection();

  worker = new Worker<GenerationJobData>(
    'assignment-generation',
    async (job: Job<GenerationJobData>) => {
      const { assignmentId } = job.data;
      const jobId = job.id!;

      logger.info({ jobId, assignmentId }, '[JOB STARTED]');

      try {
        // Step 1: Mark processing
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
        await setJobState(jobId, 'processing');
        emitProgress(jobId, 5, 'processing');

        // Step 2: Fetch assignment
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) throw new Error(`Assignment ${assignmentId} not found`);

        // Step 3: AI generation (prompt -> LLM -> Zod-validated parse)
        const paper = await generateQuestionPaper(assignment, (progress: number) => {
          emitProgress(jobId, progress, 'processing');
          job.updateProgress(progress);
        });

        // Step 4: Persist result in DB
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: 'completed',
          result: paper,
        });

        // Step 5: Cache result in Redis
        const redis = getRedisConnection();
        await redis.set(`assignment:${assignmentId}`, JSON.stringify(paper), 'EX', 3600);

        await setJobState(jobId, 'completed');

        // Step 6: Emit WebSocket events
        emitProgress(jobId, 100, 'completed');
        emitCompleted(jobId, assignmentId, paper);

        logger.info({ jobId, assignmentId }, '[JOB COMPLETED]');
        return paper;
      } catch (error: any) {
        logger.error({ jobId, assignmentId, error: error.message }, '[JOB FAILED]');

        // Ensure DB is always updated on failure
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: 'failed',
        });

        await setJobState(jobId, 'failed');
        emitError(jobId, error.message);
        throw error;
      }
    },
    {
      connection: connection.options as any,
      concurrency: 2,
    }
  );

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, '[WORKER] Job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, error: err.message }, '[WORKER] Job failed');
  });

  worker.on('error', (err) => {
    logger.error({ error: err.message }, '[WORKER] System error');
  });

  logger.info('BullMQ Worker initialized -> assignment-generation');
  return worker;
};
