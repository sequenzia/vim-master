# CLAUDE.md - The Dark Magic of Vim

## Project Overview

An interactive, gamified web application teaching Vim fundamentals through a fantasy-themed interface. Players learn Vim commands (hjkl navigation, editing, insert mode) by completing levels guided by a wizard NPC powered by Vercel AI Gateway.

## Tech Stack

- **Language**: TypeScript 5.8
- **Framework**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS 4
- **AI**: Vercel AI SDK v6 with AI Gateway
- **Fonts**: Fira Code (monospace), Cinzel (fantasy headers)

## Quick Start

```bash
# Install dependencies
npm install

# Set API key in .env.local
AI_GATEWAY_API_KEY=your_key_here

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build
```

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with fonts/metadata
│   ├── page.tsx             # Main game page (client component)
│   ├── globals.css          # Tailwind + custom styles
│   └── api/
│       ├── chat/route.ts    # Streaming chat endpoint (useChat)
│       ├── dialogue/route.ts # Quick wizard reactions
│       └── level/route.ts   # AI level generation with Zod
├── components/
│   ├── VimEditor.tsx        # Main Vim simulator with cursor/mode handling
│   ├── ChatBot.tsx          # AI chat interface with useChat hook
│   ├── PlayerHUD.tsx        # Header bar with XP, rank, achievements
│   ├── LeftSidebar.tsx      # Left panel: wizard avatar, level info, hints
│   ├── TargetPreview.tsx    # Shows expected result with line comparison
│   ├── CheatSheets.tsx      # Vim cheat sheet thumbnails + modal viewer
│   └── AchievementToast.tsx # Achievement unlock notifications
├── lib/
│   ├── ai.ts                # Shared AI config (models, system prompt)
│   └── gameApi.ts           # Client-side API helpers
├── types.ts                 # TypeScript interfaces/enums
├── constants.ts             # Tutorial levels, achievements, ranks
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind theme customization
└── postcss.config.mjs       # PostCSS configuration
```

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Central game state, level flow, achievement triggers |
| `app/api/chat/route.ts` | Streaming chat with AI Gateway |
| `app/api/level/route.ts` | AI level generation with Zod schema |
| `lib/ai.ts` | Shared AI config, wizard system prompt |
| `components/VimEditor.tsx` | Vim mode simulation, keypress handling |
| `components/ChatBot.tsx` | Chat UI with useChat hook |
| `types.ts` | VimMode enum, Level/GameState/PlayerProfile interfaces |
| `constants.ts` | TUTORIAL_LEVELS, ACHIEVEMENTS, RANKS data |

## Architecture

### State Management
- React hooks (useState, useEffect, useCallback, useRef)
- GameState centralized in app/page.tsx
- PlayerProfile persisted to localStorage (`vim_wizard_profile`)

### Vim Simulation
- VimMode enum: NORMAL, INSERT, VISUAL
- Buffer as string array (lines), Cursor as {row, col}
- Level win conditions checked on every buffer/cursor change

### AI Integration
- **Chat API** (`/api/chat`): Uses `streamText` with AI Gateway for streaming responses
- **Dialogue API** (`/api/dialogue`): Uses `generateText` for quick wizard reactions
- **Level API** (`/api/level`): Uses `generateObject` with Zod schema for structured level generation
- All endpoints use `gateway('google/gemini-2.5-flash')` provider
- Fallback responses if API fails

### UI Layout
- **Header** (PlayerHUD): Logo, rank badge, XP progress bar, achievement icons
- **Left Sidebar** (LeftSidebar): Wizard avatar, level info, objective, hints, cheat sheets, wizard dialogue
- **Main Area**: VimEditor (center) with TargetPreview showing expected result
- **Right Panel**: ChatBot AI assistant with streaming responses

## Coding Conventions

- **Components**: PascalCase files, React.FC with typed props, `'use client'` directive for client components
- **API Routes**: `route.ts` files in `app/api/` directories
- **Constants**: UPPER_SNAKE_CASE
- **Imports**: Use `@/` path alias for all project imports
- **AI SDK**: Use `streamText` for chat, `generateText` for one-shot, `generateObject` for structured output

## Game Mechanics

- **Levels 0-2**: Hardcoded tutorials (movement, delete, insert)
- **Level 3+**: AI-generated infinite levels
- **XP**: 150 per level
- **Ranks**: Muggle (0) → Master of Death (5000+ XP)
- **Achievements**: 6 unlockable (first_steps, quick_learner, etc.)

## Supported Vim Commands

**Normal Mode**: h/j/k/l (move), w/b (word), x (delete), 0/$ (line start/end), i (insert)
**Insert Mode**: Type characters, Backspace, Enter, Escape (exit)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_GATEWAY_API_KEY` | Yes | Vercel AI Gateway API key |

## Common Tasks

### Add a new tutorial level
Edit `constants.ts` → `TUTORIAL_LEVELS` array

### Add new achievement
1. Add to `ACHIEVEMENTS` in `constants.ts`
2. Add unlock condition in `app/page.tsx` achievement checking logic

### Add new Vim command
Edit `components/VimEditor.tsx` → `handleKeyDown` function

### Modify AI wizard personality
Edit `lib/ai.ts` → `WIZARD_SYSTEM_PROMPT` constant

### Add a new cheat sheet
Edit `components/CheatSheets.tsx` → `CHEAT_SHEETS` array with id, title, url

### Change AI model
Edit `lib/ai.ts` → `MODELS` constant (e.g., `google/gemini-2.5-pro`)
