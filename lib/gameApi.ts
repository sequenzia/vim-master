import type { Level } from '@/types';

export async function generateWizardDialogue(
  context: string,
  emotion: string
): Promise<string> {
  try {
    const response = await fetch('/api/dialogue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, emotion }),
    });

    if (!response.ok) throw new Error('API error');

    const { dialogue } = await response.json();
    return dialogue;
  } catch (error) {
    console.error('Wizard silence:', error);
    return 'The spirits of the machine are restless (API Error).';
  }
}

export async function generateInfiniteLevel(
  currentLevel: number,
  topic: string
): Promise<Partial<Level>> {
  try {
    const response = await fetch('/api/level', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentLevel, topic }),
    });

    if (!response.ok) throw new Error('API error');

    return await response.json();
  } catch (error) {
    console.error('Level generation failed:', error);
    return {
      title: "The Void's Error",
      description: 'The infinite generator has stumbled.',
      startText: ['Error generating level.', 'Fix this manually.'],
      targetText: ['Level generated.', 'Fixed manually.'],
      wizardIntro: 'Something interferes with my scrying...',
      wizardSuccess: 'You fixed the unfixable.',
    };
  }
}
