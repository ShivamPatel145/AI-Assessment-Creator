import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { requireUser } from '../../utils/requireUser';
import { createAssignmentSchema } from './assignment.schema';
import { generatePdf } from '../../utils/pdf.generator';
import { difficultyColorMap } from './assignment.model';
import { getJobProgress } from '../queue/queue';
import * as service from './assignment.service';

// POST /assignments
export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    // If multer stored a file, expose a public URL for the uploaded file so
    // downstream workers can fetch it. When the frontend sends FormData the
    // fields will be available on req.body after multer runs.
    if ((req as any).file) {
      const file = (req as any).file;
      const host = req.get('host');
      const proto = req.protocol;
      // Public URL served from /uploads
      (req as any).body.fileUrl = `${proto}://${host}/uploads/${file.filename}`;
    }

    const parsed = createAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((i: { message: string }) => i.message).join(', ');
      res.status(400).json({ error: messages });
      return;
    }

    const { jobId, assignmentId } = await service.createAssignmentService(parsed.data, user._id.toString());
    res.status(201).json({ jobId, assignmentId });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Server error' });
  }
};

// GET /assignments
export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    const assignments = await service.getAssignmentsService(user._id.toString());
    res.json({ assignments });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// GET /assignments/:id
export const getAssignmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const assignment = await service.getAssignmentByIdService(id) as any;
    const assignmentObj = typeof assignment?.toObject === 'function' ? assignment.toObject() : assignment;

    if (assignmentObj.status !== 'completed' && assignmentObj.status !== 'failed') {
      res.json({
        _id: assignmentObj._id,
        status: assignmentObj.status,
        jobId: assignmentObj.jobId,
        title: assignmentObj.title,
        subject: assignmentObj.subject,
        grade: assignmentObj.grade,
        duration: assignmentObj.duration,
        examDate: assignmentObj.examDate,
        totalMarks: assignmentObj.totalMarks,
      });
    } else {
      res.json({ ...assignmentObj, difficultyColorMap });
    }
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// GET /assignments/:id/status
export const getAssignmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const assignment = await service.getAssignmentStatusService(id);
    res.json({ status: assignment.status });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// DELETE /assignments/:id
export const deleteAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    const id = req.params.id as string;
    await service.deleteAssignmentService(id, user._id.toString());
    res.json({ message: 'Assignment deleted' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// POST /assignments/:id/regenerate
export const regenerateAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = requireUser(req);
    const id = req.params.id as string;
    const data = await service.regenerateAssignmentService(id, user._id.toString());
    res.json(data);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// GET /assignments/:id/pdf
export const downloadAssignmentPdf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const assignment = await service.getAssignmentByIdService(id);
    if (!assignment.result) {
      res.status(400).json({ error: 'Result not generated yet' });
      return;
    }
    const user = requireUser(req);
    generatePdf(assignment, res, user);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// GET /jobs/:jobId (Fallback Polling)
export const getJobStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobId = req.params.jobId as string;
    const data = await getJobProgress(jobId);
    res.json(data);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
