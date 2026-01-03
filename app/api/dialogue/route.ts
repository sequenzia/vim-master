import { generateText } from 'ai';
import { getDialogueModel } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { context, emotion } = await req.json();

    const prompt = `
      You are Anthony, the Grand Wizard of Vim. You are teaching a student the dark arts of text editing.
      Your tone is cryptic, slightly arrogant but helpful, and steeped in fantasy/eldritch lore.
      Current Context: ${context}
      Your Emotion: ${emotion}

      Generate a short, one-sentence remark (max 20 words).
    `;

    const { text } = await generateText({
      model: getDialogueModel(),
      prompt,
    });

    return NextResponse.json({ dialogue: text || '...The void is silent...' });
  } catch (error) {
    console.error('Dialogue generation error:', error);
    return NextResponse.json(
      { dialogue: 'The spirits of the machine are restless (API Error).' },
      { status: 500 }
    );
  }
}
