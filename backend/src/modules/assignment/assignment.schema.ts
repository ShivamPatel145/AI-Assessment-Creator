import { z } from 'zod';

// ── Input Validation ──────────────────────────────────────────────────
export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().optional().default(''),
  grade: z.string().optional().default(''),
  duration: z.union([z.string(), z.number()]).optional(),
  examDate: z.string().optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  questionsConfig: z.array(
    z.object({
      type: z.string().min(1, 'Question type is required'),
      count: z.number().min(1, 'Count must be at least 1'),
      marks: z.number().min(1, 'Marks must be at least 1'),
    })
  ).optional(),
  instructions: z.string().optional().default(''),
  fileUrl: z.string().optional().default(''),
  totalMarks: z.number().optional(),
  numberOfQuestions: z.number().optional(),
  questionTypes: z.union([z.string(), z.array(z.string())]).optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

// ── AI Response Validation ────────────────────────────────────────────
export const aiQuestionSchema = z.object({
  question: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  marks: z.number(),
});

export const aiSectionSchema = z.object({
  title: z.string(),
  instructions: z.string(),
  questions: z.array(aiQuestionSchema),
});

export const aiResultSchema = z.object({
  sections: z.array(aiSectionSchema),
});

export type AIResult = z.infer<typeof aiResultSchema>;
