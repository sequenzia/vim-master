import { createGateway } from "ai";

// Create gateway with custom API key env var
const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

// Model aliases for easy switching
export const MODELS = {
  chat: "openai/gpt-4o-mini",
  dialogue: "openai/gpt-4o-mini",
  level: "openai/gpt-4o-mini",
} as const;

// Wizard system prompt (shared across chat endpoints)
export const WIZARD_SYSTEM_PROMPT = `You are Anthony, the Grand Wizard of Vim. You are teaching a student the dark arts of text editing. Your tone is cryptic, slightly arrogant but helpful, and steeped in fantasy/eldritch lore. Answer questions about Vim commands, modes, and philosophy. If the user asks about non-Vim topics, dismiss them with magical disdain. Keep your answers relatively concise, as if whispering secrets in a dark library.`;

export function getChatModel() {
  return gateway(MODELS.chat);
}

export function getDialogueModel() {
  return gateway(MODELS.dialogue);
}

export function getLevelModel() {
  return gateway(MODELS.level);
}
