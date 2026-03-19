// DO NOT import dotenv here - it's loaded in env.ts
// This file should ONLY read from process.env

// TEMPORARY WORKAROUND: Hardcode API key if system env is wrong
const GEMINI_KEY = process.env.GEMINI_API_KEY === 'YOUR_REAL_KEY' 
  ? 'AIzaSyCpZ4OV730AwK53xnHji41BTXyqBriE5BA'
  : process.env.GEMINI_API_KEY!;

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI!,
  redis: {
    url: process.env.REDIS_URL || '',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  geminiApiKey: process.env.GEMINI_API_KEY!,
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

// Debug log (remove in production)
console.log('📋 Config loaded:');
console.log('  - Port:', config.port);
console.log('  - MongoDB:', config.mongodbUri ? '✓ Set' : '✗ Missing');
console.log('  - Gemini API Key:', config.geminiApiKey ? `✓ Set (${config.geminiApiKey.length} chars, starts with ${config.geminiApiKey.substring(0, 10)}...)` : '✗ Missing');
console.log('  - Redis URL:', config.redis.url ? '✓ Set' : '✗ Missing');
console.log('  - Frontend URL:', config.frontendUrl);

