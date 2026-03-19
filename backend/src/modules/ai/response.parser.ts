import { IResult } from '../assignment/assignment.model';
import { aiResultSchema } from '../assignment/assignment.schema';

export const parseResponse = (text: string): IResult => {
  try {
    let raw: any;

    // Step 1: Extract JSON from LLM text
    try {
      raw = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Failed to extract valid JSON from LLM response');
      raw = JSON.parse(jsonMatch[0]);
    }

    // Step 2: Normalize difficulty values before validation
    if (raw.sections && Array.isArray(raw.sections)) {
      for (const section of raw.sections) {
        if (!section.questions) continue;
        for (const question of section.questions) {
          const diff = question.difficulty?.toLowerCase();
          question.difficulty = ['easy', 'medium', 'hard'].includes(diff) ? diff : 'medium';
          question.marks = Number(question.marks) || 1;
        }
      }
    }

    // Step 3: Zod schema validation — STRICT. Never return raw AI text.
    const validated = aiResultSchema.parse(raw);

    return validated as IResult;
  } catch (error: any) {
    throw new Error(`AI response parse/validation failed: ${error.message}`);
  }
};
