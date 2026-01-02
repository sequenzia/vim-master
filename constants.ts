import { Level, Cursor } from './types';

export const TUTORIAL_LEVELS: Level[] = [
  {
    id: 1,
    title: "The Four Directions",
    description: "Move the cursor to the 'X' using h, j, k, l.",
    startText: [
      "The path is dark.",
      "Navigate to the X",
      "     X     ",
      "Trust your fingers."
    ],
    targetText: (buffer: string[], cursor: Cursor) => {
      // Win if cursor is on the X
      return cursor.row === 2 && cursor.col === 5;
    },
    allowedKeys: ['h', 'j', 'k', 'l'],
    hints: ['h: left', 'j: down', 'k: up', 'l: right'],
    wizardIntro: "Welcome, initiate. I am Anthony. To wield the dark magic, you must first learn to move without the rodent (mouse). Use H, J, K, L.",
    wizardSuccess: "Acceptable. Your fingers begin to remember."
  },
  {
    id: 2,
    title: "The Curse of Extra Characters",
    description: "Exorcise the ghosts (g) using 'x'.",
    startText: [
      "Remgove theg gghosts.",
      "Cleanse thgis line.",
      "Pugrify the code."
    ],
    targetText: [
      "Remove the ghosts.",
      "Cleanse this line.",
      "Purify the code."
    ],
    allowedKeys: ['h', 'j', 'k', 'l', 'x', 'w', 'b'],
    hints: ['Move onto a "g" and press "x" to exorcise it.'],
    wizardIntro: "Phantoms infest this scroll. Place your cursor upon them and press 'x' to banish them to the void.",
    wizardSuccess: "The spirits are at rest. You are ruthless."
  },
  {
    id: 3,
    title: "Incantations (Insert)",
    description: "Complete the spells. Press 'i' to insert, 'Esc' to exit.",
    startText: [
      "The spell is: Abarcad",
      "Summon the: Daemo",
      "Vim is: Lif"
    ],
    targetText: [
      "The spell is: Abracadabra",
      "Summon the: Daemon",
      "Vim is: Life"
    ],
    allowedKeys: ['h', 'j', 'k', 'l', 'i', 'Escape'],
    hints: ["Press 'i' to start typing. Press 'Esc' to move again."],
    wizardIntro: "To create is divine. Press 'i' to enter the inner sanctum (Insert Mode). Inscribe the missing runes. Press ESCAPE to return to reality.",
    wizardSuccess: "Your creative energies are... potent."
  }
];

export const ANTHONY_IMAGE_URL = "https://storage.googleapis.com/sequenzia-public/assets/images/wizard_anthony_1.jpeg"; // Placeholder, but reliable
