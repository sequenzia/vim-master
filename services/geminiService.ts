import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Level } from "../types";

// Ensure API key is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to clean response text
const cleanText = (text: string) => text.replace(/```json/g, '').replace(/```/g, '').trim();

export const generateWizardDialogue = async (context: string, emotion: string): Promise<string> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      You are Anthony, the Grand Wizard of Vim. You are teaching a student the dark arts of text editing.
      Your tone is cryptic, slightly arrogant but helpful, and steeped in fantasy/eldritch lore.
      Current Context: ${context}
      Your Emotion: ${emotion}
      
      Generate a short, one-sentence remark (max 20 words).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "...The void is silent...";
  } catch (error) {
    console.error("Wizard silence:", error);
    return "The spirits of the machine are restless (API Error).";
  }
};

export const generateInfiniteLevel = async (
  currentLevel: number,
  topic: string
): Promise<Partial<Level>> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        startText: { type: Type.ARRAY, items: { type: Type.STRING } },
        goalText: { type: Type.ARRAY, items: { type: Type.STRING } },
        wizardIntro: { type: Type.STRING },
        wizardSuccess: { type: Type.STRING },
      },
      required: ["title", "description", "startText", "goalText", "wizardIntro", "wizardSuccess"],
    };

    const prompt = `
      Create a Vim training level about: ${topic}.
      Level Number: ${currentLevel}.
      
      The 'startText' should contain errors or be incomplete.
      The 'goalText' is the corrected version.
      The changes required should strictly be achievable using basic Vim motions (hjkl, w, b) and edits (x, i, A, r).
      Keep the text short (max 4 lines).
      Theme: Dark Magic, Necromancy, Cyber-Witchcraft.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const data = JSON.parse(cleanText(response.text));
    
    return {
      id: currentLevel,
      allowedKeys: ['h', 'j', 'k', 'l', 'i', 'x', 'w', 'b', 'Escape', '0', '$'],
      hints: ["Use the force... err, the keys."],
      title: data.title,
      description: data.description,
      startText: data.startText,
      targetText: data.goalText,
      wizardIntro: data.wizardIntro,
      wizardSuccess: data.wizardSuccess
    };

  } catch (error) {
    console.error("Level generation failed:", error);
    // Fallback level
    return {
      title: "The Void's Error",
      description: "The infinite generator has stumbled.",
      startText: ["Error generating level.", "Fix this manually."],
      targetText: ["Level generated.", "Fixed manually."],
      wizardIntro: "Something interferes with my scrying...",
      wizardSuccess: "You fixed the unfixable."
    };
  }
};