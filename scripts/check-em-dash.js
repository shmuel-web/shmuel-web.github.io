#!/usr/bin/env node

/**
 * Check for em dashes (—) in markdown files within content/ directory
 * Exits with code 1 if any found, 0 if clean
 */

import { readFileSync } from 'fs';
import { glob } from 'glob';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const EM_DASH = '—';
const CONTENT_DIR = join(projectRoot, 'content');

// Find all .md files in content directory
const files = glob.sync('**/*.md', {
  cwd: CONTENT_DIR,
  absolute: true,
});

let hasErrors = false;
const errors = [];

// Check each file
for (const filePath of files) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Check each line for em dash
  lines.forEach((line, lineNumber) => {
    const column = line.indexOf(EM_DASH);
    if (column !== -1) {
      hasErrors = true;
      const relativePath = filePath.replace(projectRoot + '/', '');
      errors.push({
        file: relativePath,
        line: lineNumber + 1,
        column: column + 1,
        lineContent: line.trim(),
      });
    }
  });
}

// Report results
if (hasErrors) {
  console.error('\n❌ Found em dash(es) in markdown files:\n');
  
  errors.forEach(({ file, line, column, lineContent }) => {
    console.error(`  ${file}:${line}:${column}`);
    console.error(`    ${lineContent}`);
  });
  
  console.error(`\nFound ${errors.length} occurrence(s).`);
  console.error('Run "npm run fix:emdash" to automatically remove them.\n');
  process.exit(1);
} else {
  console.log('✅ No em dashes found in markdown files.');
  process.exit(0);
}
