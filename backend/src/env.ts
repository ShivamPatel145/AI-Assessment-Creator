import dotenv from 'dotenv';
import path from 'path';

// Load .env file IMMEDIATELY - this must run before ANY other imports
// Use override: true to force .env values over system environment variables
const result = dotenv.config({ 
  path: path.resolve(__dirname, '../.env'),
  override: true  // CRITICAL: Override system environment variables
});

if (result.error) {
  console.error('❌ Failed to load .env file:', result.error);
  throw new Error('Environment configuration failed');
}

console.log('✅ Environment variables loaded from .env (with override)');

// Validate critical variables exist
const requiredVars = ['MONGODB_URI', 'GEMINI_API_KEY', 'JWT_SECRET'];
const missing = requiredVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:', missing);
  throw new Error(`Missing required env vars: ${missing.join(', ')}`);
}

console.log('✅ All required environment variables present');
console.log('🔑 GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY?.substring(0, 15) + '...');
