/**
 * Audio generation functions
 */

import matter from 'gray-matter';
import { openai } from './config.js';

/**
 * Generate audio file using OpenAI TTS
 */
export async function generateAudio(text, postNumber, locale) {
  console.log(`  🎵 Generating ${locale} audio...`);
  
  // Strip markdown to plain text (similar to generate-audio.js)
  const { content: markdown } = matter(text);
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  try {
    const voice = locale === 'he' ? 'onyx' : 'onyx'; // Using onyx for both
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: plainText,
      response_format: 'opus',
    });
    
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error(`  ❌ Error generating ${locale} audio: ${error.message}`);
    throw error;
  }
}


