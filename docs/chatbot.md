# Chatbot Architecture

This document explains how the AI chatbot works in the Vim Wizard application.

## Overview

The chatbot is an interactive AI assistant named "Anthony, the Grand Wizard of Vim" that helps users learn Vim commands. It uses the Vercel AI SDK with streaming responses to provide a responsive chat experience.

## Components

### 1. Frontend: ChatBot Component

**File:** `components/ChatBot.tsx`

The `ChatBot` component is a React client component that renders the chat interface.

#### Key Features

- **useChat Hook**: Uses `@ai-sdk/react`'s `useChat` hook for state management and streaming
- **Auto-scroll**: Automatically scrolls to the latest message
- **Loading Indicator**: Shows animated dots while waiting for AI response
- **Initial Message**: Displays a welcome message from the wizard

#### Hook Configuration

```typescript
const { messages, input, setInput, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  initialMessages: [
    {
      id: 'initial',
      role: 'assistant',
      content: 'Speak, apprentice. What forbidden knowledge do you seek?',
    },
  ],
});
```

#### UI Structure

1. **Header**: Wizard avatar and title
2. **Messages Area**: Scrollable container for chat history
3. **Input Form**: Text input and send button

### 2. Backend: Chat API Route

**File:** `app/api/chat/route.ts`

The API route handles POST requests from the chat interface.

#### Implementation

```typescript
import { streamText, convertToModelMessages } from "ai";
import { getChatModel, WIZARD_SYSTEM_PROMPT } from "@/lib/ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: getChatModel(),
    system: WIZARD_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

#### Key Points

- **maxDuration**: Set to 30 seconds to allow for longer responses
- **streamText**: Enables real-time streaming of AI responses
- **convertToModelMessages**: Converts UI messages to the format expected by the AI model
- **toUIMessageStreamResponse**: Returns a streaming response compatible with the `useChat` hook

### 3. AI Configuration

**File:** `lib/ai.ts`

Centralizes AI model configuration and prompts.

#### Gateway Setup

```typescript
import { createGateway } from "ai";

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});
```

The Vercel AI Gateway provides a unified interface for accessing different AI providers.

#### Model Configuration

```typescript
export const MODELS = {
  chat: "openai/gpt-4o-mini",
  dialogue: "openai/gpt-4o-mini",
  level: "openai/gpt-4o-mini",
} as const;
```

All AI features use GPT-4o-mini through the gateway.

#### Wizard Personality

```typescript
export const WIZARD_SYSTEM_PROMPT = `You are Anthony, the Grand Wizard of Vim.
You are teaching a student the dark arts of text editing. Your tone is cryptic,
slightly arrogant but helpful, and steeped in fantasy/eldritch lore. Answer
questions about Vim commands, modes, and philosophy. If the user asks about
non-Vim topics, dismiss them with magical disdain. Keep your answers relatively
concise, as if whispering secrets in a dark library.`;
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ChatBot.tsx                                │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  useChat({ api: '/api/chat' })                               │   │
│  │    - messages: Message[]                                      │   │
│  │    - input: string                                           │   │
│  │    - handleSubmit: () => void                                │   │
│  │    - isLoading: boolean                                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼ POST /api/chat
┌─────────────────────────────────────────────────────────────────────┐
│                       app/api/chat/route.ts                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  streamText({                                                │   │
│  │    model: getChatModel(),                                    │   │
│  │    system: WIZARD_SYSTEM_PROMPT,                             │   │
│  │    messages: convertToModelMessages(messages)                │   │
│  │  })                                                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           lib/ai.ts                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  gateway("openai/gpt-4o-mini")                               │   │
│  │    → Vercel AI Gateway                                       │   │
│  │    → OpenAI GPT-4o-mini                                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼ Streaming Response
                    ┌───────────────────────┐
                    │   AI Response Tokens  │
                    │   (streamed back to   │
                    │   ChatBot component)  │
                    └───────────────────────┘
```

## Related: Dialogue API

**File:** `app/api/dialogue/route.ts`

A separate endpoint for quick, one-sentence wizard reactions used elsewhere in the game (not the main chat).

```typescript
export async function POST(req: Request) {
  const { context, emotion } = await req.json();

  const { text } = await generateText({
    model: getDialogueModel(),
    prompt: `...context and emotion...`,
  });

  return NextResponse.json({ dialogue: text });
}
```

**Client Helper:** `lib/gameApi.ts`

```typescript
export async function generateWizardDialogue(
  context: string,
  emotion: string
): Promise<string> {
  const response = await fetch('/api/dialogue', {
    method: 'POST',
    body: JSON.stringify({ context, emotion }),
  });
  const { dialogue } = await response.json();
  return dialogue;
}
```

### Differences from Chat API

| Feature | Chat API | Dialogue API |
|---------|----------|--------------|
| Response type | Streaming | Single response |
| AI SDK function | `streamText` | `generateText` |
| Use case | Interactive conversation | Quick reactions |
| Message history | Full conversation | Single context |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_GATEWAY_API_KEY` | Yes | Vercel AI Gateway API key |

## Error Handling

- **Chat API**: Relies on the AI SDK's built-in error handling; the `useChat` hook manages errors client-side
- **Dialogue API**: Returns a fallback message on error: "The spirits of the machine are restless (API Error)."

## Customization

### Changing the AI Model

Edit `lib/ai.ts`:

```typescript
export const MODELS = {
  chat: "openai/gpt-4o",  // Upgrade to GPT-4o
  // ...
};
```

### Modifying the Wizard Personality

Edit the `WIZARD_SYSTEM_PROMPT` in `lib/ai.ts` to change how the wizard responds.

### Adding Chat History Persistence

The current implementation does not persist chat history. To add persistence:

1. Store messages in `localStorage` or a database
2. Pass persisted messages as `initialMessages` to `useChat`
