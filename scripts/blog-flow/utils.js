/**
 * Utility functions
 */

import { existsSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { CONTENT_DIR } from './config.js';

/**
 * Find the highest post number and return next number
 */
export function getNextPostNumber() {
  if (!existsSync(CONTENT_DIR)) {
    return '001';
  }
  
  const entries = readdirSync(CONTENT_DIR, { withFileTypes: true });
  const postNumbers = entries
    .filter(entry => entry.isDirectory())
    .map(entry => parseInt(entry.name, 10))
    .filter(num => !isNaN(num))
    .sort((a, b) => b - a);
  
  if (postNumbers.length === 0) {
    return '001';
  }
  
  const nextNum = postNumbers[0] + 1;
  return String(nextNum).padStart(3, '0');
}

/**
 * Find original_audio file in directory
 */
export function findOriginalAudio(dir) {
  if (!existsSync(dir)) {
    return null;
  }
  
  const files = readdirSync(dir);
  const audioFile = files.find(file => 
    file.startsWith('original_audio.') && 
    !file.endsWith('.md')
  );
  
  return audioFile ? join(dir, audioFile) : null;
}

/**
 * Determine post number from directory name or auto-increment
 */
export function determinePostNumber(postDir) {
  const dirName = basename(postDir);
  
  if (/^\d+$/.test(dirName)) {
    // Directory name is already a number
    return dirName.padStart(3, '0');
  } else {
    // Auto-increment
    const postNumber = getNextPostNumber();
    console.log(`  📝 Using post number: ${postNumber}`);
    return postNumber;
  }
}


