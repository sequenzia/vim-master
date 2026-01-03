import { Level, Cursor, Rank, Achievement } from "./types";

export const TUTORIAL_LEVELS: Level[] = [
  {
    id: 1,
    title: "The Four Directions",
    description: "Move the cursor to the 'X' using h, j, k, l.",
    startText: [
      "The path is dark.",
      "Navigate to the X",
      "     X     ",
      "Trust your fingers.",
    ],
    targetText: (buffer: string[], cursor: Cursor) => {
      // Win if cursor is on the X
      return cursor.row === 2 && cursor.col === 5;
    },
    allowedKeys: ["h", "j", "k", "l"],
    hints: ["h: left", "j: down", "k: up", "l: right"],
    wizardIntro:
      "Welcome, initiate. I'm Anthony. To wield the dark magic, you must first learn to move without the rodent (mouse). Use H, J, K, L.",
    wizardSuccess: "Acceptable. Your fingers begin to remember.",
  },
  {
    id: 2,
    title: "The Curse of Extra Characters",
    description: "Exorcise the ghosts (g) using 'x'.",
    startText: [
      "Remgove theg gghosts.",
      "Cleanse thgis line.",
      "Pugrify the code.",
    ],
    targetText: [
      "Remove the ghosts.",
      "Cleanse this line.",
      "Purify the code.",
    ],
    allowedKeys: ["h", "j", "k", "l", "x", "w", "b"],
    hints: ['Move onto a "g" and press "x" to exorcise it.'],
    wizardIntro:
      "Phantoms infest this scroll. Place your cursor upon them and press 'x' to banish them to the void.",
    wizardSuccess: "The spirits are at rest. You are ruthless.",
  },
  {
    id: 3,
    title: "Incantations (Insert)",
    description: "Complete the spells. Press 'i' to insert, 'Esc' to exit.",
    startText: ["The spell is: Abarcad", "Summon the: Daemo", "Vim is: Lif"],
    targetText: [
      "The spell is: Abracadabra",
      "Summon the: Daemon",
      "Vim is: Life",
    ],
    allowedKeys: ["h", "j", "k", "l", "i", "a", "Escape"],
    hints: ["Press 'i' to start typing. Press 'Esc' to move again."],
    wizardIntro:
      "To create is divine. Press 'i' to enter the inner sanctum (Insert Mode). Inscribe the missing runes. Press ESCAPE to return to reality.",
    wizardSuccess: "Your creative energies are... potent.",
  },
];

export const ANTHONY_IMAGE_URL =
  "https://storage.googleapis.com/sequenzia-public/assets/images/wizard_anthony_1.jpeg";

export const RANKS: Rank[] = [
  { title: "Muggle", minXP: 0, color: "text-gray-500" },
  { title: "First Year Student", minXP: 100, color: "text-green-400" },
  { title: "Prefect", minXP: 300, color: "text-blue-400" },
  { title: "Auror", minXP: 600, color: "text-red-400" },
  { title: "Order of the Phoenix", minXP: 1000, color: "text-orange-500" },
  { title: "Headmaster", minXP: 2000, color: "text-purple-400" },
  {
    title: "Master of Death",
    minXP: 5000,
    color: "text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_blood",
    title: "First Blood",
    description: "Complete the first level",
    icon: "🩸",
  },
  {
    id: "ghost_buster",
    title: "Ghost Buster",
    description: "Banish the extra characters",
    icon: "👻",
  },
  {
    id: "scribe",
    title: "The Scribe",
    description: "Successfully use Insert mode",
    icon: "📜",
  },
  {
    id: "void_walker",
    title: "Void Walker",
    description: "Complete an AI generated level",
    icon: "🌌",
  },
  {
    id: "high_roller",
    title: "High Roller",
    description: "Reach 1000 XP",
    icon: "💎",
  },
  {
    id: "mastery",
    title: "Tutorial Complete",
    description: "Finish all tutorial levels",
    icon: "🎓",
  },
];
