# CLAUDE.md - The Dark Magic of Vim

## Project Overview

An interactive, gamified web application teaching Vim fundamentals through a fantasy-themed interface. Players learn Vim commands (hjkl navigation, editing, insert mode) by completing levels guided by a wizard NPC powered by Google Gemini AI.

## Tech Stack

- **Language**: TypeScript 5.8
- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (CDN-loaded)
- **AI**: Google Gemini (@google/genai)
- **Fonts**: Fira Code (monospace), Cinzel (fantasy headers)

## Quick Start

```bash
# Install dependencies
npm install

# Set API key in .env.local
GEMINI_API_KEY=your_key_here

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build
```

## Project Structure

```
├── components/
│   ├── VimEditor.tsx        # Main Vim simulator with cursor/mode handling
│   ├── Wizard.tsx           # NPC wizard avatar and speech bubbles
│   ├── ChatBot.tsx          # AI chat interface with Gemini
│   ├── PlayerHUD.tsx        # XP, rank, achievements display
│   └── AchievementToast.tsx # Achievement unlock notifications
├── services/
│   └── geminiService.ts     # Gemini AI integration (chat, level gen)
├── App.tsx                  # Main app, game state management
├── types.ts                 # TypeScript interfaces/enums
├── constants.ts             # Tutorial levels, achievements, ranks
├── index.tsx                # React entry point
└── index.html               # HTML template with Tailwind config
```

## Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Central game state, level flow, achievement triggers |
| `components/VimEditor.tsx` | Vim mode simulation, keypress handling |
| `services/geminiService.ts` | AI chat, dialogue generation, level generation |
| `types.ts` | VimMode enum, Level/GameState/PlayerProfile interfaces |
| `constants.ts` | TUTORIAL_LEVELS, ACHIEVEMENTS, RANKS data |

## Architecture

### State Management
- React hooks (useState, useEffect, useCallback, useRef)
- GameState centralized in App.tsx
- PlayerProfile persisted to localStorage (`vim_wizard_profile`)

### Vim Simulation
- VimMode enum: NORMAL, INSERT, VISUAL
- Buffer as string array (lines), Cursor as {row, col}
- Level win conditions checked on every buffer/cursor change

### AI Integration
- Chat: System prompt for wizard roleplay personality
- Level generation: JSON schema for structured level responses
- Fallback responses if API fails

## Coding Conventions

- **Components**: PascalCase files, React.FC with typed props
- **Services**: camelCase files
- **Constants**: UPPER_SNAKE_CASE
- **Imports**: React first, then types, then local modules
- **Path alias**: `@/*` resolves to project root

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
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI features |

## Common Tasks

### Add a new tutorial level
Edit `constants.ts` → `TUTORIAL_LEVELS` array

### Add new achievement
1. Add to `ACHIEVEMENTS` in `constants.ts`
2. Add unlock condition in `App.tsx` achievement checking logic

### Add new Vim command
Edit `VimEditor.tsx` → `handleKeyDown` function

### Modify AI wizard personality
Edit `geminiService.ts` → `createWizardChat` system instruction
