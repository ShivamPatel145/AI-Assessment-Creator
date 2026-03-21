import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { AppError } from '../utils/AppError';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export interface ExplainAnswerInput {
  question: string;
  studentAnswer: string;
  answerKey: string;
  subject?: string;
  grade?: string;
}

export interface ExplainAnswerOutput {
  summary: string;
  strengths: string[];
  gaps: string[];
  nextSteps: string[];
  scoreBand: string;
}

const fallbackParser = (text: string): ExplainAnswerOutput => {
  return {
    summary: text.slice(0, 220),
    strengths: [],
    gaps: [],
    nextSteps: [],
    scoreBand: 'Need Review',
  };
};

export const explainStudentAnswerService = async (input: ExplainAnswerInput): Promise<ExplainAnswerOutput> => {
  if (!input.question?.trim() || !input.studentAnswer?.trim() || !input.answerKey?.trim()) {
    throw new AppError('question, studentAnswer and answerKey are required', 400);
  }

  const prompt = `You are an expert teacher mentor. Evaluate a student's answer.

Return ONLY valid JSON with this shape:
{
  "summary": "short 2-3 sentence feedback",
  "strengths": ["..."],
  "gaps": ["..."],
  "nextSteps": ["concrete action for student"],
  "scoreBand": "Excellent | Good | Developing | Need Review"
}

Context:
Subject: ${input.subject || 'General'}
Grade: ${input.grade || 'N/A'}
Question: ${input.question}
Ideal Answer: ${input.answerKey}
Student Answer: ${input.studentAnswer}

Rules:
- Use clear teacher-friendly language.
- Keep nextSteps specific and practical.
- Be constructive, not harsh.
- No markdown.`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, topP: 0.9, topK: 30 },
  });

  const text = result.response.text();

  try {
    const parsed = JSON.parse(text);
    return {
      summary: parsed.summary || '',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
      scoreBand: parsed.scoreBand || 'Need Review',
    };
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || '',
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
          nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
          scoreBand: parsed.scoreBand || 'Need Review',
        };
      } catch {
        return fallbackParser(text);
      }
    }
    return fallbackParser(text);
  }
};
