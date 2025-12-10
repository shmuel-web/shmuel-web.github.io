/**
 * Configuration and OpenAI client setup
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

// Load environment variables
dotenv.config({ path: join(projectRoot, '.env') });

export const CONTENT_DIR = join(projectRoot, 'content', 'blog');

// Check for OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('❌ Error: OPENAI_API_KEY not found in .env file');
  process.exit(1);
}

export const openai = new OpenAI({ apiKey });


