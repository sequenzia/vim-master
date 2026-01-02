
import React, { useState, useEffect, useCallback } from 'react';
import VimEditor from './components/VimEditor';
import Wizard from './components/Wizard';
import ChatBot from './components/ChatBot';
import PlayerHUD from './components/PlayerHUD';
import AchievementToast from './components/AchievementToast';
import { VimMode, GameState, Level, PlayerProfile, Achievement } from './types';
import { TUTORIAL_LEVELS, ACHIEVEMENTS, RANKS } from './constants';
import { generateInfiniteLevel, generateWizardDialogue } from './services/geminiService';

const DEFAULT_PROFILE: PlayerProfile = {
  xp: 0,
  unlockedAchievements: [],
  levelsCompleted: 0
};

const App: React.FC = () => {
  // Load profile from local storage if available
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem('vim_wizard_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

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

  // Save profile whenever it changes
  useEffect(() => {
    localStorage.setItem('vim_wizard_profile', JSON.stringify(playerProfile));
  }, [playerProfile]);

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
      let newXP = prev.xp + 150; // Base XP
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

  if (!currentLevelData) return <div className="text-white text-center mt-20 font-mono">Summoning the Editor...</div>;

  return (
    <div className="min-h-screen bg-vim-bg text-vim-fg p-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
         <div className="absolute top-10 left-10 text-9xl font-fantasy text-purple-900">VIM</div>
         <div className="absolute bottom-10 right-10 text-9xl font-fantasy text-purple-900">ESC</div>
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-4">
        
        {/* Header */}
        <header className="text-center mb-4">
          <h1 className="text-4xl md:text-6xl font-fantasy text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">
            Dark Magic of Vim
          </h1>
        </header>

        {/* Player HUD */}
        <PlayerHUD profile={playerProfile} />

        {/* Wizard */}
        <Wizard message={wizardMessage} emotion={gameState.isLevelComplete ? 'happy' : 'neutral'} />

        {/* Main Game Area */}
        <div className="relative">
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
          
          {/* Objective Overlay (Helpful Hint) */}
          {!gameState.isLevelComplete && (
            <div className="mt-4 bg-black/50 p-4 rounded border border-gray-700 font-mono text-sm text-gray-300 flex justify-between items-center">
               <div>
                 <span className="text-purple-400 font-bold">OBJECTIVE:</span> {currentLevelData.description}
               </div>
               <div className="text-xs text-gray-500">Level {currentLevelData.id}</div>
            </div>
          )}

          {/* Target Preview (For comparison levels) */}
           {!gameState.isLevelComplete && Array.isArray(currentLevelData.targetText) && (
              <div className="mt-2 text-xs text-gray-600 font-mono">
                  <p>Target:</p>
                  {currentLevelData.targetText.map((l, i) => <div key={i}>{l}</div>)}
              </div>
           )}
        </div>

        {/* Controls / Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={resetLevel}
            className="px-6 py-2 bg-gray-800 hover:bg-red-900 text-gray-300 rounded font-mono border border-gray-600 transition-colors"
          >
            Reset Scroll
          </button>
          
          {gameState.isLevelComplete && (
            <button 
              onClick={nextLevel}
              className="px-8 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded font-mono font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-bounce"
            >
              Next Ritual →
            </button>
          )}
        </div>

      </div>

      <ChatBot />
      <AchievementToast achievement={newAchievement} onClose={() => setNewAchievement(null)} />
    </div>
  );
};

export default App;
