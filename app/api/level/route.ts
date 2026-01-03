import { generateObject } from 'ai';
import { getLevelModel } from '@/lib/ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const levelSchema = z.object({
  title: z.string(),
  description: z.string(),
  startText: z.array(z.string()),
  goalText: z.array(z.string()),
  wizardIntro: z.string(),
  wizardSuccess: z.string(),
});

export async function POST(req: Request) {
  try {
    const { currentLevel, topic } = await req.json();

    const prompt = `
      Create a Vim training level about: ${topic}.
      Level Number: ${currentLevel}.

      The 'startText' should contain errors or be incomplete.
      The 'goalText' is the corrected version.
      The changes required should strictly be achievable using basic Vim motions (hjkl, w, b) and edits (x, i, A, r).
      Keep the text short (max 4 lines).
      Theme: Dark Magic, Necromancy, Cyber-Witchcraft.
    `;

    const { object } = await generateObject({
      model: getLevelModel(),
      schema: levelSchema,
      prompt,
    });

    return NextResponse.json({
      id: currentLevel,
      allowedKeys: ['h', 'j', 'k', 'l', 'i', 'x', 'w', 'b', 'Escape', '0', '$'],
      hints: ['Use the force... err, the keys.'],
      title: object.title,
      description: object.description,
      startText: object.startText,
      targetText: object.goalText,
      wizardIntro: object.wizardIntro,
      wizardSuccess: object.wizardSuccess,
    });
  } catch (error) {
    console.error('Level generation failed:', error);
    return NextResponse.json({
      id: 0,
      title: "The Void's Error",
      description: 'The infinite generator has stumbled.',
      startText: ['Error generating level.', 'Fix this manually.'],
      targetText: ['Level generated.', 'Fixed manually.'],
      wizardIntro: 'Something interferes with my scrying...',
      wizardSuccess: 'You fixed the unfixable.',
      allowedKeys: ['h', 'j', 'k', 'l', 'i', 'x', 'w', 'b', 'Escape', '0', '$'],
      hints: ['Use the force... err, the keys.'],
    });
  }
}
