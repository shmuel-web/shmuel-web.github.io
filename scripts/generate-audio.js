#!/usr/bin/env node

/**
 * Generate audio files for blog posts using OpenAI TTS API
 * Only processes non-draft posts
 * Skips posts where audio file already exists
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import OpenAI from 'openai';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
dotenv.config({ path: join(projectRoot, '.env') });

const CONTENT_DIR = join(projectRoot, 'content', 'blog');

// Check for OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('❌ Error: OPENAI_API_KEY not found in .env file');
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Get all post numbers from content/blog directory
 */
function getPostNumbers() {
  try {
    if (!existsSync(CONTENT_DIR)) {
      return [];
    }
    const entries = readdirSync(CONTENT_DIR, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();
  } catch (error) {
    console.error(`Error reading content directory: ${error.message}`);
    return [];
  }
}

/**
 * Check if post is a draft
 */
function isDraft(postNumber, locale) {
  const filePath = join(CONTENT_DIR, postNumber, `${locale}.md`);
  if (!existsSync(filePath)) return false;
  
  const content = readFileSync(filePath, 'utf8');
  const { data } = matter(content);
  return data.draft === true;
}

/**
 * Strip markdown syntax to get plain text
 * Note: Frontmatter is already removed by gray-matter, so markdown parameter
 * only contains the actual markdown content
 */
function stripMarkdownToText(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  return markdown
    // Remove code blocks (both fenced and indented)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    // Remove HTML tags (in case any slip through)
    .replace(/<[^>]*>/g, '')
    // Remove links but keep text [text](url) -> text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove reference-style links [text][ref] -> text
    .replace(/\[([^\]]+)\]\[[^\]]+\]/g, '$1')
    // Remove images but keep alt text ![alt](url) -> alt
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
    // Remove reference-style images ![alt][ref] -> alt
    .replace(/!\[([^\]]*)\]\[[^\]]+\]/g, '$1')
    // Remove bold/italic but keep text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove strikethrough
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove headers but keep text
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    // Remove horizontal rules
    .replace(/^[-*]{3,}$/gm, '')
    // Remove list markers (unordered)
    .replace(/^[\s]*[-*+]\s+/gm, '')
    // Remove list markers (ordered) but preserve numbering context
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove reference definitions
    .replace(/^\[.+\]:\s*.+$/gm, '')
    // Clean up multiple spaces
    .replace(/  +/g, ' ')
    // Clean up multiple newlines (keep paragraph breaks)
    .replace(/\n{3,}/g, '\n\n')
    // Clean up leading/trailing whitespace on each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Final trim
    .trim();
}

/**
 * Extract plain text from markdown file
 */
function extractPlainText(postNumber, locale) {
  const filePath = join(CONTENT_DIR, postNumber, `${locale}.md`);
  const content = readFileSync(filePath, 'utf8');
  const { data, content: markdown } = matter(content);
  
  // Convert markdown to plain text
  const plainText = stripMarkdownToText(markdown);
  
  return { plainText, frontmatter: data };
}

/**
 * Check if audio file already exists
 */
function audioExists(postNumber, locale) {
  const audioPath = join(CONTENT_DIR, postNumber, `listen-${locale}.opus`);
  return existsSync(audioPath);
}

/**
 * Generate audio file using OpenAI TTS
 */
async function generateAudio(text, postNumber, locale) {
  try {
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'onyx',
      input: text,
      response_format: 'opus',
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error(`  ❌ Error generating audio: ${error.message}`);
    throw error;
  }
}

/**
 * Save audio file to disk
 */
function saveAudio(buffer, postNumber, locale) {
  const audioPath = join(CONTENT_DIR, postNumber, `listen-${locale}.opus`);
  writeFileSync(audioPath, buffer);
  return audioPath;
}

/**
 * Process a single post
 */
async function processPost(postNumber, locale) {
  const audioPath = join(CONTENT_DIR, postNumber, `listen-${locale}.opus`);
  
  // Check if already exists
  if (audioExists(postNumber, locale)) {
    console.log(`  ⏭️  Audio already exists: ${audioPath}`);
    return { skipped: true };
  }

  // Check if draft
  if (isDraft(postNumber, locale)) {
    console.log(`  ⏭️  Skipping draft post: ${postNumber}/${locale}.md`);
    return { skipped: true, reason: 'draft' };
  }

  // Extract plain text
  const { plainText, frontmatter } = extractPlainText(postNumber, locale);
  
  if (!plainText || typeof plainText !== 'string' || plainText.trim().length === 0) {
    console.log(`  ⚠️  No text content found: ${postNumber}/${locale}.md`);
    return { skipped: true, reason: 'empty' };
  }

  console.log(`  📝 Processing: ${postNumber}/${locale}.md (${plainText.length} chars)`);

  if (DRY_RUN) {
    console.log(`  🔍 Dry-run: Would generate audio at ${audioPath}`);
    return { skipped: true, reason: 'dry-run' };
  }

  // Generate audio
  const buffer = await generateAudio(plainText.trim(), postNumber, locale);
  
  // Save audio file
  const savedPath = saveAudio(buffer, postNumber, locale);
  console.log(`  ✅ Generated: ${savedPath}`);
  
  return { success: true, path: savedPath };
}

/**
 * Main function
 */
async function main() {
  console.log('🎙️  Generating audio files for blog posts...\n');

  if (DRY_RUN) {
    console.log('🔍 DRY-RUN MODE: No files will be created\n');
  }

  const postNumbers = getPostNumbers();
  
  if (postNumbers.length === 0) {
    console.log('⚠️  No posts found in content/blog directory');
    process.exit(0);
  }

  console.log(`Found ${postNumbers.length} post(s)\n`);

  const locales = ['en', 'he'];
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const postNumber of postNumbers) {
    console.log(`📄 Post: ${postNumber}`);
    
    for (const locale of locales) {
      const filePath = join(CONTENT_DIR, postNumber, `${locale}.md`);
      
      if (!existsSync(filePath)) {
        continue; // Skip if markdown file doesn't exist for this locale
      }

      try {
        const result = await processPost(postNumber, locale);
        
        if (result.success) {
          processed++;
        } else {
          skipped++;
        }
      } catch (error) {
        errors++;
        console.error(`  ❌ Failed to process ${postNumber}/${locale}.md:`, error.message);
      }
    }
    
    console.log(''); // Empty line between posts
  }

  // Summary
  console.log('\n📊 Summary:');
  console.log(`  ✅ Processed: ${processed}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  if (errors > 0) {
    console.log(`  ❌ Errors: ${errors}`);
  }

  if (DRY_RUN) {
    console.log('\n🔍 Dry-run complete. Run without --dry-run to generate files.');
  }

  process.exit(errors > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

