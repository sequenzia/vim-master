'use client';

import React, { useState, useEffect, useCallback } from 'react';
import VimEditor from '@/components/VimEditor';
import LeftSidebar from '@/components/LeftSidebar';
import ChatBot from '@/components/ChatBot';
import PlayerHUD from '@/components/PlayerHUD';
import TargetPreview from '@/components/TargetPreview';
import AchievementToast from '@/components/AchievementToast';
import { VimMode, GameState, Level, PlayerProfile, Achievement } from '@/types';
import { TUTORIAL_LEVELS, ACHIEVEMENTS } from '@/constants';
import { generateInfiniteLevel, generateWizardDialogue } from '@/lib/gameApi';

const DEFAULT_PROFILE: PlayerProfile = {
  xp: 0,
  unlockedAchievements: [],
  levelsCompleted: 0
};

export default function Page() {
  // Load profile from local storage if available
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [isClient, setIsClient] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    currentLevelIndex: 0,
    isLevelComplete: false,
    score: 0,
    mode: VimMode.NORMAL,
    buffer: [],
    cursor: { row: 0, col: 0 },
    statusMessage: "",
    isLoading: true
  });

  const [currentLevelData, setCurrentLevelData] = useState<Level | null>(null);
  const [wizardMessage, setWizardMessage] = useState<string>("Loading the dark arts...");
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('vim_wizard_profile');
    if (saved) {
      setPlayerProfile(JSON.parse(saved));
    }
  }, []);

  // Save profile whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('vim_wizard_profile', JSON.stringify(playerProfile));
    }
  }, [playerProfile, isClient]);

  // Load level logic
  const loadLevel = useCallback(async (index: number) => {
    setGameState(prev => ({ ...prev, isLoading: true, isLevelComplete: false, mode: VimMode.NORMAL }));

    let level: Level;

    if (index < TUTORIAL_LEVELS.length) {
      level = TUTORIAL_LEVELS[index];
    } else {
      // Generate infinite level
      const generated = await generateInfiniteLevel(index + 1, "Refactoring Necromancy Code");
      // Merge with defaults to ensure safety
      level = {
        id: index + 1,
        title: generated.title || `Level ${index + 1}`,
        description: generated.description || "Survive.",
        startText: generated.startText || ["Error"],
        targetText: generated.targetText || ["Fixed"],
        allowedKeys: generated.allowedKeys || ['h','j','k','l'],
        hints: generated.hints || [],
        wizardIntro: generated.wizardIntro || "Begin.",
        wizardSuccess: generated.wizardSuccess || "Done."
      };
    }

    setCurrentLevelData(level);
    setGameState(prev => ({
      ...prev,
      currentLevelIndex: index,
      buffer: [...level.startText],
      cursor: { row: 0, col: 0 },
      isLoading: false,
      statusMessage: level.description
    }));
    setWizardMessage(level.wizardIntro);

  }, []);

  // Initialize
  useEffect(() => {
    loadLevel(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check win condition
  useEffect(() => {
    if (!currentLevelData || gameState.isLoading || gameState.isLevelComplete) return;

    let isWin = false;

    // Check if target is function or array
    if (typeof currentLevelData.targetText === 'function') {
      isWin = currentLevelData.targetText(gameState.buffer, gameState.cursor);
    } else {
      // Array comparison
      isWin = JSON.stringify(gameState.buffer) === JSON.stringify(currentLevelData.targetText);
    }

    if (isWin) {
      handleLevelComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.buffer, gameState.cursor]);

  const unlockAchievement = (id: string, currentUnlocked: string[]) => {
    if (!currentUnlocked.includes(id)) {
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        setNewAchievement(ach);
        return true;
      }
    }
    return false;
  };

  const handleLevelComplete = async () => {
    setGameState(prev => ({ ...prev, isLevelComplete: true, score: prev.score + 100 }));

    // Update Profile (XP & Achievements)
    setPlayerProfile(prev => {
      const newXP = prev.xp + 150; // Base XP
      const newLevelsCompleted = prev.levelsCompleted + 1;
      const newUnlocked = [...prev.unlockedAchievements];

      // Check Specific Achievement Conditions
      if (currentLevelData?.id === 1 && unlockAchievement('first_blood', prev.unlockedAchievements)) {
         newUnlocked.push('first_blood');
      }
      if (currentLevelData?.id === 2 && unlockAchievement('ghost_buster', prev.unlockedAchievements)) {
        newUnlocked.push('ghost_buster');
      }
      if (currentLevelData?.id === 3 && unlockAchievement('scribe', prev.unlockedAchievements)) {
        newUnlocked.push('scribe');
      }
      if (gameState.currentLevelIndex >= TUTORIAL_LEVELS.length && unlockAchievement('void_walker', prev.unlockedAchievements)) {
        newUnlocked.push('void_walker');
      }
      if (newLevelsCompleted === TUTORIAL_LEVELS.length && unlockAchievement('mastery', prev.unlockedAchievements)) {
        newUnlocked.push('mastery');
      }
      if (newXP >= 1000 && unlockAchievement('high_roller', prev.unlockedAchievements)) {
        newUnlocked.push('high_roller');
      }

      return {
        ...prev,
        xp: newXP,
        levelsCompleted: newLevelsCompleted,
        unlockedAchievements: newUnlocked
      };
    });

    // Generate reaction or use static
    if (currentLevelData) {
        setWizardMessage(currentLevelData.wizardSuccess);

        // Optional: dynamic wizard flair
        if (gameState.currentLevelIndex >= TUTORIAL_LEVELS.length) {
             const dynamicFlair = await generateWizardDialogue("The student has completed a complex necromancy refactor.", "impressed");
             setWizardMessage(dynamicFlair);
        }
    }
  };

  const nextLevel = () => {
    loadLevel(gameState.currentLevelIndex + 1);
  };

  const resetLevel = () => {
    if (currentLevelData) {
      setGameState(prev => ({
        ...prev,
        buffer: [...currentLevelData.startText],
        cursor: { row: 0, col: 0 },
        mode: VimMode.NORMAL,
        isLevelComplete: false
      }));
    }
  };

  const resetAllProgress = () => {
    if (confirm("Are you sure you want to start over? All progress, XP, and achievements will be lost.")) {
      setPlayerProfile(DEFAULT_PROFILE);
      localStorage.removeItem('vim_wizard_profile');
      loadLevel(0);
      setWizardMessage("A fresh start, young apprentice. The dark arts await once more...");
    }
  };

  if (!currentLevelData) {
    return (
      <div className="h-screen bg-vim-bg flex items-center justify-center">
        <div className="text-purple-400 font-mono animate-pulse">Summoning the Editor...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-vim-bg text-vim-fg flex flex-col overflow-hidden">
      {/* Top Bar */}
      <PlayerHUD profile={playerProfile} />

      {/* Main Three-Column Layout */}
      <div className="flex-1 grid grid-cols-[260px_1fr_320px] min-h-0">
        {/* Left Sidebar */}
        <LeftSidebar
          level={currentLevelData}
          wizardMessage={wizardMessage}
          isLevelComplete={gameState.isLevelComplete}
        />

        {/* Center: Editor + Target + Controls */}
        <main className="flex flex-col p-4 gap-4 min-h-0 overflow-hidden">
          {/* Vim Editor */}
          <div className="flex-1 min-h-0">
            <VimEditor
              lines={gameState.buffer}
              cursor={gameState.cursor}
              mode={gameState.mode}
              onBufferChange={(lines) => setGameState(prev => ({ ...prev, buffer: lines }))}
              onCursorChange={(cursor) => setGameState(prev => ({ ...prev, cursor }))}
              onModeChange={(mode) => setGameState(prev => ({ ...prev, mode }))}
              allowedKeys={currentLevelData.allowedKeys}
              isLevelComplete={gameState.isLevelComplete}
            />
          </div>

          {/* Target Preview */}
          <TargetPreview
            targetText={currentLevelData.targetText}
            currentBuffer={gameState.buffer}
            isComplete={gameState.isLevelComplete}
          />

          {/* Controls */}
          <div className="flex justify-center gap-3 shrink-0">
            <button
              onClick={resetAllProgress}
              className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-300 rounded font-mono text-sm border border-red-800/50 transition-colors"
            >
              Start Over
            </button>

            <button
              onClick={resetLevel}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded font-mono text-sm border border-gray-600 transition-colors"
            >
              Reset Level
            </button>

            {gameState.isLevelComplete && (
              <button
                onClick={nextLevel}
                className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded font-mono font-bold transition-colors shadow-lg"
              >
                Next Level
              </button>
            )}
          </div>
        </main>

        {/* Right Sidebar: Chat */}
        <ChatBot />
      </div>

      {/* Achievement Toast */}
      <AchievementToast achievement={newAchievement} onClose={() => setNewAchievement(null)} />
    </div>
  );
}
