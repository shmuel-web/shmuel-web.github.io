#!/usr/bin/env node

/**
 * Blog Flow: Convert audio recording to bilingual blog post
 * 
 * Usage: node scripts/blog-flow/index.js <post_directory>
 * Example: node scripts/blog-flow/index.js content/blog/004
 */

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { findOriginalAudio, determinePostNumber } from './utils.js';
import { transcribeAudio, generateHebrewPost, translateToEnglish, polishText } from './llm.js';
import { generateAudio } from './audio.js';

/**
 * Main processing function
 */
async function processPost(postDir) {
  console.log(`\n📄 Processing: ${postDir}`);
  
  // Find original_audio file
  const audioPath = findOriginalAudio(postDir);
  if (!audioPath) {
    console.log(`  ⚠️  No original_audio file found in ${postDir}`);
    return;
  }
  
  // Check if post already exists
  const existingHe = join(postDir, 'he.md');
  const existingEn = join(postDir, 'en.md');
  
  if (existsSync(existingHe) || existsSync(existingEn)) {
    console.log(`  ⚠️  Post already exists in ${postDir}, skipping...`);
    return;
  }
  
  // Determine post number
  const postNumber = determinePostNumber(postDir);
  
  try {
    // Step 1: Transcribe audio
    const transcription = await transcribeAudio(audioPath);
    console.log(`  ✅ Transcription complete (${transcription.length} chars)`);
    
    // Step 2: Generate Hebrew post
    let hebrewPost = await generateHebrewPost(transcription, postNumber);
    console.log(`  ✅ Hebrew post generated`);
    
    // Step 3: Polish Hebrew
    hebrewPost = await polishText(hebrewPost, 'he');
    console.log(`  ✅ Hebrew post polished`);
    
    // Step 4: Translate to English
    let englishPost = await translateToEnglish(hebrewPost);
    console.log(`  ✅ English post translated`);
    
    // Step 5: Polish English
    englishPost = await polishText(englishPost, 'en');
    console.log(`  ✅ English post polished`);
    
    // Step 6: Generate audio files
    const heAudioBuffer = await generateAudio(hebrewPost, postNumber, 'he');
    const enAudioBuffer = await generateAudio(englishPost, postNumber, 'en');
    
    // Step 7: Save files
    const hePath = join(postDir, 'he.md');
    const enPath = join(postDir, 'en.md');
    const heAudioPath = join(postDir, 'listen-he.opus');
    const enAudioPath = join(postDir, 'listen-en.opus');
    
    writeFileSync(hePath, hebrewPost, 'utf8');
    writeFileSync(enPath, englishPost, 'utf8');
    writeFileSync(heAudioPath, heAudioBuffer);
    writeFileSync(enAudioPath, enAudioBuffer);
    
    console.log(`  ✅ Files saved:`);
    console.log(`     - ${hePath}`);
    console.log(`     - ${enPath}`);
    console.log(`     - ${heAudioPath}`);
    console.log(`     - ${enAudioPath}`);
    
    console.log(`\n  ✨ Post ${postNumber} created successfully as draft!`);
    console.log(`  📝 Review and remove 'draft: true' from frontmatter when ready to publish.\n`);
    
  } catch (error) {
    console.error(`  ❌ Error processing post: ${error.message}`);
    throw error;
  }
}

// Main execution
const postDir = process.argv[2];

if (!postDir) {
  console.error('❌ Error: Post directory required');
  console.error('Usage: node scripts/blog-flow/index.js <post_directory>');
  console.error('Example: node scripts/blog-flow/index.js content/blog/004');
  process.exit(1);
}

processPost(postDir).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});


