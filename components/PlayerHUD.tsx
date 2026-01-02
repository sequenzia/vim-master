
import React from 'react';
import { PlayerProfile, Rank, Achievement } from '../types';
import { RANKS, ACHIEVEMENTS } from '../constants';

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

  // Rank Icons based on HP theme
  const getRankIcon = (idx: number) => {
    switch(idx) {
      case 0: return '🎒'; // Muggle
      case 1: return '🪄'; // First Year
      case 2: return '🛡️'; // Prefect
      case 3: return '⚡'; // Auror
      case 4: return '🔥'; // Order
      case 5: return '🧙‍♂️'; // Headmaster
      case 6: return '💀'; // Master of Death
      default: return '🔮';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 p-4 bg-gray-900/90 border border-gray-700 rounded-lg flex flex-col md:flex-row items-center gap-4 shadow-lg backdrop-blur-md animate-fade-in">
      
      {/* Avatar / Rank Icon */}
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-purple-500 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(168,85,247,0.3)]">
           {getRankIcon(rankIndex)}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-gray-800 text-xs px-1.5 py-0.5 rounded border border-gray-600 font-mono text-purple-300">
           Lvl {rankIndex + 1}
        </div>
      </div>

      {/* Stats Area */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-baseline mb-1">
          <h2 className={`text-xl font-fantasy font-bold ${currentRank.color}`}>
            {currentRank.title}
          </h2>
          <span className="font-mono text-xs text-gray-400">
            {profile.xp} XP / {nextRank ? nextRank.minXP : 'MAX'} XP
          </span>
        </div>

        {/* XP Bar */}
        <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative">
           <div 
             className="h-full bg-gradient-to-r from-purple-900 to-purple-500 transition-all duration-1000 ease-out"
             style={{ width: `${progress}%` }}
           ></div>
           {/* Scanline effect on bar */}
           <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>

      {/* Badges / Achievements Preview */}
      <div className="hidden md:flex gap-2">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = profile.unlockedAchievements.includes(ach.id);
          return (
             <div 
               key={ach.id} 
               className={`w-8 h-8 flex items-center justify-center rounded border ${isUnlocked ? 'bg-purple-900/50 border-purple-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-700 grayscale'}`}
               title={ach.title + (isUnlocked ? " (Unlocked)" : " (Locked)")}
             >
               {ach.icon}
             </div>
          );
        })}
      </div>

    </div>
  );
};

export default PlayerHUD;
