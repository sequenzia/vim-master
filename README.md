# The Dark Magic of Vim

An interactive, gamified web application that teaches Vim fundamentals through a fantasy-themed interface. Players learn essential Vim commands by completing levels guided by Anthony, a wizard NPC powered by AI.

## Features

- **Interactive Vim Editor** - A browser-based Vim simulator with cursor, modes, and real-time feedback
- **AI Wizard Guide** - Anthony the Grand Wizard provides cryptic guidance, hints, and reactions using AI
- **Tutorial Levels** - Three handcrafted levels teaching navigation (hjkl), deletion (x), and insert mode (i)
- **Infinite AI-Generated Levels** - After tutorials, the AI generates endless new challenges
- **Progression System** - Earn XP, unlock achievements, and climb the ranks from Muggle to Master of Death
- **Cheat Sheets** - Quick reference guides for Vim commands

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.8
- **UI**: React 19 + Tailwind CSS 4
- **AI**: Vercel AI SDK v6 with AI Gateway
- **Fonts**: Fira Code (monospace), Cinzel (fantasy headers)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/vim-master.git
cd vim-master

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
```

### Running the App

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build
npm start
```

## Supported Vim Commands

### Normal Mode
| Key | Action |
|-----|--------|
| `h` | Move left |
| `j` | Move down |
| `k` | Move up |
| `l` | Move right |
| `w` | Jump to next word |
| `b` | Jump to previous word |
| `x` | Delete character under cursor |
| `0` | Jump to start of line |
| `$` | Jump to end of line |
| `i` | Enter Insert mode |
| `a` | Enter Insert mode after cursor |

### Insert Mode
| Key | Action |
|-----|--------|
| Any character | Insert text |
| `Backspace` | Delete previous character |
| `Enter` | Insert new line |
| `Escape` | Return to Normal mode |

## Game Mechanics

### Levels
- **Levels 1-3**: Handcrafted tutorials introducing core concepts
- **Level 4+**: AI-generated challenges with increasing complexity

### Progression
- **XP**: Earn 150 XP per level completed
- **Ranks**: Progress through 7 ranks based on total XP
  - Muggle (0 XP)
  - First Year Student (100 XP)
  - Prefect (300 XP)
  - Auror (600 XP)
  - Order of the Phoenix (1000 XP)
  - Headmaster (2000 XP)
  - Master of Death (5000 XP)

### Achievements
- First Blood - Complete the first level
- Ghost Buster - Banish the extra characters
- The Scribe - Successfully use Insert mode
- Void Walker - Complete an AI-generated level
- High Roller - Reach 1000 XP
- Tutorial Complete - Finish all tutorial levels

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with fonts/metadata
│   ├── page.tsx             # Main game page
│   └── api/
│       ├── chat/route.ts    # Streaming chat endpoint
│       ├── dialogue/route.ts # Quick wizard reactions
│       └── level/route.ts   # AI level generation
├── components/
│   ├── VimEditor.tsx        # Vim simulator with cursor/mode handling
│   ├── ChatBot.tsx          # AI chat interface
│   ├── PlayerHUD.tsx        # Header bar with XP, rank, achievements
│   ├── LeftSidebar.tsx      # Wizard avatar, level info, hints
│   ├── TargetPreview.tsx    # Expected result comparison
│   ├── CheatSheets.tsx      # Vim cheat sheet viewer
│   └── AchievementToast.tsx # Achievement notifications
├── lib/
│   ├── ai.ts                # AI config and system prompts
│   └── gameApi.ts           # Client-side API helpers
├── types.ts                 # TypeScript interfaces
└── constants.ts             # Tutorial levels, achievements, ranks
```

## Contributing

Contributions are welcome! Feel free to:

- Add new tutorial levels in `constants.ts`
- Implement additional Vim commands in `VimEditor.tsx`
- Create new achievements in `constants.ts` and `app/page.tsx`
- Customize the wizard's personality in `lib/ai.ts`

## License

MIT
