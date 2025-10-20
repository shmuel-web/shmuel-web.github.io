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

### 4. Content Guidelines
- Use standard Markdown syntax
- Images should be placed in `public/` directory
- Both language versions will be automatically linked
- Posts are sorted by date (newest first)

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
