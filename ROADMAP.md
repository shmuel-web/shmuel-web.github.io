# Project Roadmap

This document outlines the planned features and enhancements for the blog project.

## Upcoming Features

### 1. Post Discussion & Feedback System
- **Goal**: Enable readers to engage with blog posts through comments and discussions
- **Features to implement**:
  - Comment system for each blog post
  - Thread-based discussions
  - Support for both English and Hebrew discussions
  - Moderation tools
  - Mobile-optimized feedback interface

### 2. AI-Powered Text-to-Audiobook
- **Goal**: Convert blog post text into audio format for better accessibility and convenience
- **Features to implement**:
  - AI text-to-speech integration
  - Audio player component with playback controls
  - Support for both English and Hebrew audio generation
  - Downloadable audio files
  - Mobile-friendly audio player interface
  - Quality voice synthesis with natural pronunciation

### 3. blog-flow
- **Goal** Convert a recording of myself into a blog post
- **Features to implement**:
  - easy way to upload original recording to github
  - gh-action to transcribe the audio
  - send it to an LLM with a prompt to turn it in to a post in hebrew wiht the tags Summary and title
  - translate the post to english
  - go over the text to polish it and make it as readable as possible, adding dots, exlemation marks, divideing it to pragraphs etc  
  - generate audio content for the post

## Implementation Considerations

### Technical Requirements
- Audio processing and storage
- API integration for TTS services
- Database/backend for feedback storage (if needed)
- Authentication system for comment moderation (optional)

### Design Principles
- All features should be mobile-first
- Support for both Hebrew and English languages
- Maintain existing design aesthetic
- Accessibility considerations

---

*Last updated: January 2025*





