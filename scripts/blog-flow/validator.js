/**
 * Markdown post validation functions
 */

import matter from 'gray-matter';
import { openai } from './config.js';

/**
 * Validate markdown post structure and content
 * Returns array of validation errors, empty array if valid
 */
export function validateMarkdownPost(markdown, expectedPostNumber) {
  const errors = [];
  
  try {
    const { data: frontmatter, content } = matter(markdown);
    
    // Check required frontmatter fields
    if (!frontmatter.post_number) {
      errors.push('Missing frontmatter field: post_number');
    } else if (frontmatter.post_number !== expectedPostNumber) {
      errors.push(`post_number mismatch: expected ${expectedPostNumber}, got ${frontmatter.post_number}`);
    }
    
    if (!frontmatter.title || (typeof frontmatter.title === 'string' && frontmatter.title.trim() === '')) {
      errors.push('Missing or empty frontmatter field: title');
    }
    
    if (!frontmatter.date) {
      errors.push('Missing frontmatter field: date');
    } else {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(frontmatter.date)) {
        errors.push(`Invalid date format: ${frontmatter.date} (expected YYYY-MM-DD)`);
      }
    }
    
    if (!frontmatter.summary || (typeof frontmatter.summary === 'string' && frontmatter.summary.trim() === '')) {
      errors.push('Missing or empty frontmatter field: summary');
    }
    
    if (!frontmatter.tags || !Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
      errors.push('Missing or empty frontmatter field: tags (must be an array)');
    }
    
    if (frontmatter.draft === undefined || frontmatter.draft !== true) {
      errors.push('Missing or incorrect frontmatter field: draft (must be true)');
    }
    
    // Check content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      errors.push('Missing or empty content body');
    } else if (content.trim().length < 100) {
      errors.push(`Content too short: ${content.trim().length} characters (minimum 100 expected)`);
    }
    
    // Check markdown structure
    if (!markdown.includes('---')) {
      errors.push('Missing frontmatter delimiters (---)');
    }
    
    // Check for proper frontmatter closing
    const frontmatterMatches = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (!frontmatterMatches) {
      errors.push('Invalid frontmatter format: missing closing --- delimiter');
    }
    
  } catch (error) {
    errors.push(`Failed to parse markdown: ${error.message}`);
  }
  
  return errors;
}

/**
 * Fix markdown post by calling LLM with validation feedback
 */
async function fixMarkdownWithFeedback(markdown, errors, locale, originalPrompt, systemPrompt) {
  const isHebrew = locale === 'he';
  
  const feedbackPrompt = isHebrew
    ? `הפוסט שנוצר אינו תקין. יש בעיות הבאות:

${errors.map(e => `- ${e}`).join('\n')}

הפוסט המקורי:
${markdown}

אנא תקן את הבעיות הבאות:
${errors.map(e => `- ${e}`).join('\n')}

וודא שהפוסט כולל:
1. Frontmatter תקין עם כל השדות הנדרשים (post_number, title, date, summary, tags, draft)
2. תוכן מלא ומפורט (לפחות 100 תווים)
3. פורמט Markdown תקין עם מפרידי frontmatter (---)

החזר רק את התוכן המתוקן בפורמט Markdown עם frontmatter, ללא הסברים נוספים.`
    : `The generated post is invalid. The following issues were found:

${errors.map(e => `- ${e}`).join('\n')}

The original post:
${markdown}

Please fix the following issues:
${errors.map(e => `- ${e}`).join('\n')}

Ensure the post includes:
1. Valid frontmatter with all required fields (post_number, title, date, summary, tags, draft)
2. Full and detailed content (at least 100 characters)
3. Valid Markdown format with frontmatter delimiters (---)

Return only the corrected content in Markdown format with frontmatter, without any additional explanations.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: originalPrompt,
        },
        {
          role: 'assistant',
          content: markdown,
        },
        {
          role: 'user',
          content: feedbackPrompt,
        },
      ],
      temperature: 0.3,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(`  ❌ Error fixing markdown: ${error.message}`);
    throw error;
  }
}

/**
 * Validate and fix markdown post with retry logic
 */
export async function validateAndFixMarkdown(markdown, expectedPostNumber, locale, originalPrompt, systemPrompt, maxRetries = 3) {
  let currentMarkdown = markdown;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    const errors = validateMarkdownPost(currentMarkdown, expectedPostNumber);
    
    if (errors.length === 0) {
      if (attempt > 0) {
        console.log(`  ✅ Validation passed after ${attempt} retry(ies)`);
      }
      return currentMarkdown;
    }
    
    attempt++;
    console.log(`  ⚠️  Validation failed (attempt ${attempt}/${maxRetries}):`);
    errors.forEach(error => console.log(`     - ${error}`));
    
    if (attempt >= maxRetries) {
      throw new Error(`Failed to generate valid markdown after ${maxRetries} attempts. Errors: ${errors.join('; ')}`);
    }
    
    console.log(`  🔄 Retrying with feedback...`);
    currentMarkdown = await fixMarkdownWithFeedback(currentMarkdown, errors, locale, originalPrompt, systemPrompt);
  }
  
  // This should never be reached, but just in case
  return currentMarkdown;
}


