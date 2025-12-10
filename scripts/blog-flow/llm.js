/**
 * LLM interaction functions (transcription, generation, translation, polishing)
 */

import { readFileSync } from 'fs';
import { basename } from 'path';
import matter from 'gray-matter';
import { openai } from './config.js';
import { validateAndFixMarkdown, validateMarkdownPost } from './validator.js';

/**
 * Transcribe audio using OpenAI Whisper
 */
export async function transcribeAudio(audioPath) {
  console.log(`  🎙️  Transcribing audio: ${basename(audioPath)}`);
  
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: readFileSync(audioPath),
      model: 'whisper-1',
      language: 'he', // Assuming Hebrew recordings
    });
    
    return transcription.text;
  } catch (error) {
    console.error(`  ❌ Error transcribing audio: ${error.message}`);
    throw error;
  }
}

/**
 * Generate Hebrew blog post from transcription
 */
export async function generateHebrewPost(transcription, postNumber) {
  console.log(`  ✍️  Generating Hebrew post...`);
  
  const systemPrompt = `אתה עוזר מקצועי לכתיבת בלוג. אתה יודע לכתוב בעברית רהוטה ולעצב תוכן מעניין וקריא. אתה מבין את המבנה של פוסטי בלוג ומכיר את הפורמט של Markdown עם frontmatter.`;

  const userPrompt = `אתה עוזר לכתיבת בלוג. המטרה היא להפוך תמלול של הקלטה לעברית לפוסט בלוג מקצועי.

התמלול:
${transcription}

אנא צור פוסט בלוג בעברית עם המבנה הבא:

1. Frontmatter (ב-YAML):
   - post_number: ${postNumber}
   - title: כותרת מעניינת ומתאימה (עד 2 שורות, אפשר להשתמש ב-pipe | לשורות מרובות)
   - date: ${new Date().toISOString().split('T')[0]}
   - summary: סיכום קצר ומעניין של הפוסט (2-3 משפטים)
   - tags: רשימה של תגיות רלוונטיות (3-5 תגיות)
   - draft: true

2. תוכן הפוסט:
   - כתוב בעברית רהוטה וטבעית
   - חלק לפסקאות הגיוניות
   - הוסף סימני פיסוק נכונים (נקודות, פסיקים, סימני שאלה וקריאה)
   - שמור על הטון והסגנון של הדובר המקורי
   - הוסף כותרות משנה (###) אם יש צורך לחלק את התוכן
   - וודא שהטקסט קריא וזורם
   - השתמש בפורמט Markdown סטנדרטי

החזר רק את התוכן בפורמט Markdown עם frontmatter, ללא הסברים נוספים.`;

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
          content: userPrompt,
        },
      ],
      temperature: 0.7,
    });
    
    let hebrewPost = response.choices[0].message.content.trim();
    
    // Validate and fix if needed
    hebrewPost = await validateAndFixMarkdown(hebrewPost, postNumber, 'he', userPrompt, systemPrompt);
    
    return hebrewPost;
  } catch (error) {
    console.error(`  ❌ Error generating Hebrew post: ${error.message}`);
    throw error;
  }
}

/**
 * Translate Hebrew post to English
 */
export async function translateToEnglish(hebrewPost) {
  console.log(`  🌐 Translating to English...`);
  
  const { data: frontmatter, content: hebrewContent } = matter(hebrewPost);
  const expectedPostNumber = frontmatter.post_number;
  
  const systemPrompt = `You are a professional translator specializing in translating Hebrew blog posts to English while maintaining natural flow and style. You understand blog post structure and Markdown format with frontmatter.`;

  const userPrompt = `Translate this Hebrew blog post to English. Maintain the same structure, tone, and style.

Hebrew content:
${hebrewContent}

Please:
1. Translate the content naturally to English
2. Keep the same paragraph structure
3. Maintain the same headings (###)
4. Preserve the tone and style
5. Translate the frontmatter fields:
   - title: Translate to English (can use pipe | for multiple lines)
   - summary: Translate to English
   - tags: Translate to English (keep them relevant)
6. Maintain the same Markdown formatting
7. Include all required frontmatter fields: post_number, title, date, summary, tags, draft

Return only the translated Markdown with frontmatter, maintaining the same structure.`;

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
          content: userPrompt,
        },
      ],
      temperature: 0.7,
    });
    
    let englishPost = response.choices[0].message.content.trim();
    
    // Validate and fix if needed
    englishPost = await validateAndFixMarkdown(englishPost, expectedPostNumber, 'en', userPrompt, systemPrompt);
    
    // Ensure frontmatter has correct post_number and date (after validation)
    const { data: enFrontmatter, content: enContent } = matter(englishPost);
    enFrontmatter.post_number = frontmatter.post_number;
    enFrontmatter.date = frontmatter.date;
    enFrontmatter.draft = true;
    
    // Reconstruct with updated frontmatter
    englishPost = matter.stringify(enContent, enFrontmatter);
    
    return englishPost;
  } catch (error) {
    console.error(`  ❌ Error translating to English: ${error.message}`);
    throw error;
  }
}

/**
 * Polish text (add punctuation, fix formatting)
 */
export async function polishText(markdown, locale) {
  console.log(`  ✨ Polishing ${locale} text...`);
  
  const { data: frontmatter, content } = matter(markdown);
  const expectedPostNumber = frontmatter.post_number;
  
  const systemPrompt = locale === 'he' 
    ? `אתה עורך מקצועי המתמחה בעריכת תוכן בעברית. אתה יודע להוסיף סימני פיסוק נכונים, לתקן בעיות פורמט, ולשפר את הקריאות תוך שמירה על המשמעות והטון המקוריים.`
    : `You are a professional editor specializing in editing English content. You know how to add proper punctuation, fix formatting issues, and improve readability while maintaining the original meaning and tone.`;

  const userPrompt = locale === 'he'
    ? `אתה עורך מקצועי. אנא ערוך את הפוסט הזה בעברית כדי להפוך אותו לקריא ככל האפשר.

התוכן הנוכחי:
${content}

אנא:
1. הוסף סימני פיסוק נכונים (נקודות, פסיקים, סימני שאלה וקריאה)
2. וודא שיש הפסקות פסקאות הגיוניות
3. תקן בעיות פורמט
4. שפר את הקריאות תוך שמירה על המשמעות והטון המקוריים
5. שמור על כל הכותרות (###) כפי שהן
6. וודא שיש רווחים נכונים

החזר רק את התוכן המעודכן (ללא frontmatter), תוך שמירה על אותה מבנה.`
    : `You are a professional editor. Please polish this English blog post to make it as readable as possible.

Current content:
${content}

Please:
1. Add proper punctuation (periods, commas, exclamation marks, question marks)
2. Ensure proper paragraph breaks
3. Fix any formatting issues
4. Improve readability while maintaining the original meaning and tone
5. Keep all headings (###) intact
6. Ensure proper spacing

Return only the polished content (without frontmatter), maintaining the same structure.`;

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
          content: userPrompt,
        },
      ],
      temperature: 0.3,
    });
    
    const polishedContent = response.choices[0].message.content.trim();
    
    // Reconstruct with original frontmatter
    const polishedMarkdown = matter.stringify(polishedContent, frontmatter);
    
    // Validate that structure is preserved (check frontmatter and content length)
    const errors = validateMarkdownPost(polishedMarkdown, expectedPostNumber);
    if (errors.length > 0) {
      console.log(`  ⚠️  Validation issues after polishing (non-critical):`);
      errors.forEach(error => console.log(`     - ${error}`));
      // For polishing, we're more lenient - just warn but don't retry
      // The frontmatter should be preserved from original
    }
    
    return polishedMarkdown;
  } catch (error) {
    console.error(`  ❌ Error polishing ${locale} text: ${error.message}`);
    throw error;
  }
}


