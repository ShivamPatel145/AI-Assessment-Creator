import OpenAI from 'openai';
import { config } from '../../config';
import { IAssignment, IQuestionPaper } from '../assignment/assignment.model';
import { buildPrompt } from './prompt.builder';
import { parseResponse } from './response.parser';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

// Mock mode for testing without API key
const MOCK_MODE = false; // Enabled - set to false when you have OpenAI credits

const generateMockPaper = (assignment: IAssignment): IQuestionPaper => {
  const sections: any[] = [];
  
  assignment.questionsConfig.forEach((qConfig, idx) => {
    const questions = [];
    for (let i = 0; i < qConfig.count; i++) {
      questions.push({
        question: `Sample ${qConfig.type} question ${i + 1} for ${assignment.title}`,
        difficulty: ['easy', 'medium', 'hard'][i % 3] as 'easy' | 'medium' | 'hard',
        marks: qConfig.marks
      });
    }
    
    sections.push({
      title: `Section ${String.fromCharCode(65 + idx)} - ${qConfig.type.toUpperCase()}`,
      instructions: `Answer all questions in this section. Each question carries ${qConfig.marks} marks.`,
      questions
    });
  });

  return { sections };
};

export const generateQuestionPaper = async (
  assignment: IAssignment,
  onProgress?: (progress: number) => void
): Promise<IQuestionPaper> => {
  try {
    console.log('🤖 Starting question paper generation');
    console.log('   OpenAI API Key present:', !!config.openaiApiKey);
    console.log('   Mock mode:', MOCK_MODE);
    
    // If in mock mode, return dummy data
    if (MOCK_MODE) {
      console.log('⚠️  Running in MOCK MODE - generating dummy questions');
      onProgress?.(20);
      await new Promise(resolve => setTimeout(resolve, 500));
      onProgress?.(50);
      await new Promise(resolve => setTimeout(resolve, 500));
      onProgress?.(80);
      const mockPaper = generateMockPaper(assignment);
      onProgress?.(100);
      console.log('✅ Mock paper generated:', mockPaper);
      return mockPaper;
    }
    
    if (!config.openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    onProgress?.(10);

    const prompt = buildPrompt(assignment);

    onProgress?.(30);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert academic assessment generator. Generate structured exam questions in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
    
    onProgress?.(70);
    const text = completion.choices[0]?.message?.content || '';

    onProgress?.(80);
    const paper = parseResponse(text);

    onProgress?.(100);
    return paper;
  } catch (error: any) {
    console.error('AI Service Error:', error);
    throw new Error(`AI processing failed: ${error.message}`);
  }
};
