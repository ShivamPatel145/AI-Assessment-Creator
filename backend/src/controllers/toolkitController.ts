import { Request, Response } from 'express';
import * as toolkitService from '../services/toolkit.service';

export const explainStudentAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, studentAnswer, answerKey, subject, grade } = req.body;
    const data = await toolkitService.explainStudentAnswerService({
      question,
      studentAnswer,
      answerKey,
      subject,
      grade,
    });

    res.json(data);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to evaluate answer',
    });
  }
};
