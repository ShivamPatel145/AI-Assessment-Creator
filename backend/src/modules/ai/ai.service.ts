import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config';
import { IAssignment, IQuestionPaper } from '../assignment/assignment.model';
import { buildPrompt } from './prompt.builder';
import { parseResponse } from './response.parser';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

export const generateQuestionPaper = async (
  assignment: IAssignment,
  onProgress?: (progress: number) => void
): Promise<IQuestionPaper> => {
  try {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    onProgress?.(10);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    });

    onProgress?.(20);
    const prompt = buildPrompt(assignment);

    onProgress?.(30);
    const result = await model.generateContent(prompt);
    
    onProgress?.(70);
    const text = result.response.text();

    onProgress?.(80);
    // STRICT RULE: Never return raw AI text. Parse it implicitly via response.parser.ts
    const paper = parseResponse(text);

    onProgress?.(100);
    return paper;
  } catch (error: any) {
    console.error('AI Service Error:', error);
    throw new Error(`AI processing failed: ${error.message}`);
  }
};
