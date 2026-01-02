export enum VimMode {
  NORMAL = 'NORMAL',
  INSERT = 'INSERT',
  VISUAL = 'VISUAL'
}

export interface Cursor {
  row: number;
  col: number;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  startText: string[];
  targetText: string[] | ((text: string[], cursor: Cursor) => boolean);
  allowedKeys: string[];
  hints: string[];
  wizardIntro: string;
  wizardSuccess: string;
}

export interface GameState {
  currentLevelIndex: number;
  isLevelComplete: boolean;
  score: number;
  mode: VimMode;
  buffer: string[];
  cursor: Cursor;
  statusMessage: string;
  isLoading: boolean;
}

export type WizardEmotion = 'neutral' | 'happy' | 'angry' | 'casting';
