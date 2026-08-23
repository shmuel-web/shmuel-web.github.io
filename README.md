This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Bilingual Blog**: English and Hebrew support with RTL layout
- **Static Site Generation (SSG)**: Fast loading with pre-built pages
- **Mobile-First Design**: Responsive layouts optimized for mobile devices
- **Markdown Content**: Easy-to-write blog posts with frontmatter metadata

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Adding New Blog Posts

### 1. Create Post Directory
Create a new directory in `content/blog/` with your post number:
```bash
mkdir content/blog/004
```

### 2. Add Bilingual Content
Create both English and Hebrew versions of your post:

**`content/blog/004/en.md`:**
```markdown
---
post_number: 4
title: "Your Post Title"
date: "2025-01-15"
summary: "Brief description of your post"
tags: ["nextjs", "blog"]
---

Your English content here...
```

**`content/blog/004/he.md`:**
```markdown
---
post_number: 4
title: "כותרת הפוסט שלך"
date: "2025-01-15"
summary: "תיאור קצר של הפוסט"
tags: ["nextjs", "בלוג"]
---

התוכן העברי שלך כאן...
```

### 3. Frontmatter Fields
- `post_number`: Unique identifier (must match between EN/HE versions)
- `title`: Post title in the respective language
- `date`: Publication date (YYYY-MM-DD format)
- `summary`: Brief description for the blog index
- `tags`: Array of tags for categorization
- `draft`: Set to `true` to exclude from production (optional)

### 4. Available Tags

Tags should be used consistently across posts. Here is the complete list of available tags:

**Hebrew Tags:**
- `מדע` - Science
- `קבלה` - Kabbalah
- `תורה` - Torah
- `כלכלה` - Economics
- `חברה` - Society
- `תוכנה` - Software

**English Tags:**
- `Science`
- `Kabbalah`
- `Torah`
- `Economics`
- `Society`
- `Software`

**Additional Tags** (used in existing posts):
- `Between Worlds` / `בין העולמות`
- `Thinking` / `חשיבה`
- `Torah, Technology, and Society` / `תורה טכנולוגיה וחברה`
- `Beginning` / `התחלה`
- `Reflection` / `הרהור`
- `Culture & Society` / `תרבות וחברה`
- `Simplicity` / `פשטות`
- `Design` / `עיצוב`
- `RTL`
- `Redemption` / `גאולה`
- `Baal Teshuvah` / `חוזרים בתשובה`

### 5. Content Guidelines
- Use standard Markdown syntax
- Both language versions will be automatically linked
- Posts are sorted by date (newest first)

### 6. Adding Images to a Blog Post

Images can live alongside your post in `content/blog/<post_number>/` and are served at runtime via a built-in route.

1. Place your image next to the Markdown files:
   - `content/blog/004/my-photo.jpeg`
2. Reference it in Markdown using an absolute URL rooted at `/content/blog/`:
   - English:
     ```markdown
     ![My photo](/content/blog/004/my-photo.jpeg)
     ```
   - Hebrew:
     ```markdown
     ![התמונה שלי](/content/blog/004/my-photo.jpeg)
     ```

Notes:
- Supported types: jpg, jpeg, png, webp, gif, svg
- Files are returned with long-term cache headers (`Cache-Control: public, max-age=31536000, immutable`)
- Prefer reasonably sized, compressed images for faster mobile load times

## Blog Flow - Audio to Post Automation

The blog-flow feature automatically converts voice recordings into bilingual blog posts with audio playback.

### How It Works

1. **Upload Recording**: Create a new post directory and add your recording file named `original_audio.*` (any audio format supported)
2. **Automatic Processing**: When you commit or merge a PR, GitHub Actions will:
   - Transcribe the audio using OpenAI Whisper
   - Generate a Hebrew blog post with title, summary, and tags
   - Translate to English
   - Polish both versions (punctuation, paragraphs, formatting)
   - Generate audio files for both languages
   - Create posts as **drafts** for your review

### Usage

1. **Create Post Directory** (with auto-incremented number or specific number):
   ```bash
   mkdir content/blog/004
   # or let it auto-increment by using any name
   ```

2. **Add Your Recording**:
   ```bash
   # Place your recording in the post directory
   # File must be named: original_audio.*
   cp ~/my-recording.mp3 content/blog/004/original_audio.mp3
   ```

3. **Commit and Push**:
   ```bash
   git add content/blog/004/
   git commit -m "feat: add audio recording for new post"
   git push
   ```

4. **Review Generated Post**:
   - The workflow will create `he.md` and `en.md` files
   - Both posts start as **drafts** (`draft: true` in frontmatter)
   - Review the content, make any edits needed
   - When ready to publish, remove `draft: true` from both files

5. **Publish**:
   ```bash
   # Edit he.md and en.md to remove draft: true
   git add content/blog/004/
   git commit -m "publish: post 004"
   git push
   ```

### Requirements

- **GitHub Secrets**: `OPENAI_API_KEY` must be set in your repository secrets
- **File Naming**: Recording must be named `original_audio.*` (extension can be any audio format)
- **Post Directory**: Can be auto-numbered or use a specific number (e.g., `004`)

### Generated Files

After processing, the post directory will contain:
- `he.md` - Hebrew blog post (draft)
- `en.md` - English blog post (draft)
- `listen-he.opus` - Hebrew audio file
- `listen-en.opus` - English audio file
- `original_audio.*` - Your original recording (preserved)

### Manual Processing

You can also run the script manually for testing:

```bash
node scripts/blog-flow/index.js content/blog/004
```

### Notes

- Posts are automatically created as **drafts** - you must manually remove `draft: true` to publish
- The workflow triggers on push or PR merge when `original_audio.*` files are detected
- Post numbers are auto-incremented if directory name is not numeric
- Audio transcription assumes Hebrew input (can be adjusted in script)

## Git Hooks

### Pre-commit: En-dash/Em-dash checker

This repo runs `node scripts/check-em-dash.js` on `pre-commit` to ensure punctuation is consistent in content files.

Setup (first time after cloning or after dependency changes):

```bash
npm install
# simple-git-hooks runs during "prepare" and installs the git hooks
```

What it runs:

```json
"simple-git-hooks": {
  "pre-commit": "npm run check:emdash"
}
```

If the check fails, fix issues with:

```bash
npm run fix:emdash
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Deploy on Vercel (Recommended)

1. **Connect Repository**
   - Push your code to GitHub/GitLab/Bitbucket
   - Go to [Vercel](https://vercel.com/new)
   - Import your repository

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Environment Variables** (if needed)
   - Add any environment variables in Vercel dashboard
   - No additional configuration needed for basic blog functionality

4. **Deploy**
   - Click "Deploy" - Vercel will automatically build and deploy
   - Your blog will be available at `https://your-project.vercel.app`

### Manual Deployment

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

### Post-Deployment

- All blog posts are statically generated at build time
- New posts require a new deployment to be visible
- Both English (`/en/blog`) and Hebrew (`/he/blog`) versions are available
- Mobile-optimized and RTL support included

### Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains" section
3. Add your custom domain
4. Configure DNS records as instructed by Vercel
# Trigger deployment

Triggered deploy: 2025-10-20T08:26:20Z
