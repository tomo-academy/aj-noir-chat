---
description: Repository Information Overview
alwaysApply: true
---

# AJ Noir Chat Information

## Summary
AJ Noir Chat is a modern web-based AI chat application built with React, TypeScript, and Vite. It provides an interactive chat interface for users to communicate with an AI assistant powered by Google's Gemini model through Supabase Edge Functions.

## Structure
- **src/**: Main application source code containing React components, hooks, and utilities
- **public/**: Static assets like images and favicon
- **supabase/**: Supabase configuration and serverless functions for AI integration
- **components/**: UI components including chat interface elements
- **hooks/**: Custom React hooks for state management and API interactions

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.6.2
**Build System**: Vite 5.4.8
**Package Manager**: npm/bun

## Dependencies
**Main Dependencies**:
- React 18.3.1 with React DOM and React Router
- Supabase JS Client for backend integration
- TanStack React Query for data fetching
- Framer Motion for animations
- Radix UI components with shadcn/ui
- Tailwind CSS for styling
- React Markdown for rendering markdown content

**Development Dependencies**:
- Vite with SWC plugin for fast builds
- ESLint 9.11.1 for code linting
- TypeScript ESLint for static type checking
- Tailwind CSS plugins and PostCSS
- Lovable Tagger for component tagging

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Supabase Integration
**Configuration**: 
- Project ID: lcqepfwabbkfqcxpvsnk
- Edge Functions: `/supabase/functions/chat`
- Environment Variables: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY

**Edge Function**:
The project uses a Supabase Edge Function written in TypeScript (Deno runtime) to proxy requests to the Lovable AI Gateway, which connects to Google's Gemini 2.5 Flash model.

## Application Structure
**Entry Point**: src/main.tsx
**Main Components**:
- App.tsx: Main application wrapper with routing
- Index.tsx: Primary chat interface with welcome screen
- ChatInput.tsx: User input component
- ChatMessage.tsx: Message display component
- Sidebar.tsx: Navigation sidebar

**State Management**:
- useChat.ts: Custom hook for chat functionality
- React Query for API state management

## Features
- Real-time streaming responses from AI
- Markdown rendering with syntax highlighting
- Responsive design for mobile and desktop
- Suggested prompts for quick interactions
- Error handling and loading states