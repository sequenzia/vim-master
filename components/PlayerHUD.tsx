import React from 'react';
import { PlayerProfile } from '@/types';
import { RANKS, ACHIEVEMENTS } from '@/constants';

interface PlayerHUDProps {
  profile: PlayerProfile;
}

const PlayerHUD: React.FC<PlayerHUDProps> = ({ profile }) => {
  // Determine current rank
  const currentRankIndex = [...RANKS].reverse().findIndex(r => profile.xp >= r.minXP);
  const rankIndex = currentRankIndex === -1 ? 0 : RANKS.length - 1 - currentRankIndex;
  const currentRank = RANKS[rankIndex];
  const nextRank = RANKS[rankIndex + 1];

  // Calculate Progress
  let progress = 100;
  if (nextRank) {
    const range = nextRank.minXP - currentRank.minXP;
    const gained = profile.xp - currentRank.minXP;
    progress = Math.min(100, Math.max(0, (gained / range) * 100));
  }

  // Rank Icons
  const getRankIcon = (idx: number) => {
    switch(idx) {
      case 0: return '🎒';
      case 1: return '🪄';
      case 2: return '🛡️';
      case 3: return '⚡';
      case 4: return '🔥';
      case 5: return '🧙‍♂️';
      case 6: return '💀';
      default: return '🔮';
    }
  };

  return (
    <header className="bg-gray-900/95 border-b border-gray-800 px-4 py-2 flex items-center gap-4">
      {/* Logo */}
      <h1 className="font-fantasy text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold whitespace-nowrap">
        Dark Magic of Vim
      </h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Rank + XP */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getRankIcon(rankIndex)}</span>
          <span className={`font-fantasy text-sm font-bold ${currentRank.color}`}>
            {currentRank.title}
          </span>
        </div>

        {/* XP Bar */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div
              className="h-full bg-gradient-to-r from-purple-700 to-purple-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
            {profile.xp} / {nextRank ? nextRank.minXP : 'MAX'}
          </span>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="flex gap-1.5 ml-2">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = profile.unlockedAchievements.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`w-6 h-6 flex items-center justify-center rounded text-sm ${
                isUnlocked
                  ? 'bg-purple-900/50 border border-purple-600'
                  : 'bg-gray-800 border border-gray-700 opacity-40 grayscale'
              }`}
              title={ach.title + (isUnlocked ? ' (Unlocked)' : ' (Locked)')}
            >
              {ach.icon}
            </div>
          );
        })}
      </div>
    </header>
  );
};

export default PlayerHUD;
