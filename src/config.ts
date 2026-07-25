// src/config.ts
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Optional: Add validation
if (!OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set in environment variables');
}