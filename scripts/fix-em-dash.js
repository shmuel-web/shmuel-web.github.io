#!/usr/bin/env node

/**
 * Fix em dashes (—) in markdown files within content/ directory
 * Automatically removes all occurrences
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const EM_DASH = '—';
const DOUBLE_SPACE_EM_DASH = ' — ';
const CONTENT_DIR = join(projectRoot, 'content');

// Find all .md files in content directory
const files = glob.sync('**/*.md', {
  cwd: CONTENT_DIR,
  absolute: true,
});

let totalFixed = 0;
const fixedFiles = [];

// Process each file
for (const filePath of files) {
  const content = readFileSync(filePath, 'utf8');
  
  // Count occurrences before removal
  const count = (content.match(new RegExp(EM_DASH, 'g')) || []).length;
  
  if (count > 0) {
    // Remove all double space em dashes and replace with single space
    const cleanedContent = content.replace(new RegExp(DOUBLE_SPACE_EM_DASH, 'g'), ' ');
    // Remove all em dashes
    const fixedContent = cleanedContent.replace(new RegExp(EM_DASH, 'g'), '');
    
    // Write back to file
    writeFileSync(filePath, fixedContent, 'utf8');
    
    totalFixed += count;
    fixedFiles.push({
      file: filePath.replace(projectRoot + '/', ''),
      count,
    });
  }
}

// Report results
if (totalFixed > 0) {
  console.log(`\n✅ Fixed ${totalFixed} em dash(es) in ${fixedFiles.length} file(s):\n`);
  
  fixedFiles.forEach(({ file, count }) => {
    console.log(`  ${file}: removed ${count} occurrence(s)`);
  });
  
  console.log('\n');
} else {
  console.log('✅ No em dashes found to fix.');
}
