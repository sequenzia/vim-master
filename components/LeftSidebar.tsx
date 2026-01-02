import React, { useState } from 'react';
import { Level } from '../types';
import CheatSheets from './CheatSheets';

const ANTHONY_AVATAR_SM = 'https://storage.googleapis.com/sequenzia-public/assets/images/vim/wizard_anthony_sm.jpeg';
const ANTHONY_AVATAR_LG = 'https://storage.googleapis.com/sequenzia-public/assets/images/vim/wizard_anthony_lg.jpeg';

interface LeftSidebarProps {
  level: Level;
  wizardMessage: string;
  isLevelComplete: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ level, wizardMessage, isLevelComplete }) => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  return (
    <aside className="bg-gray-900/95 border-r border-gray-800 p-4 flex flex-col gap-4 overflow-y-auto">
      {/* Wizard Avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowAvatarModal(true)}
          className="relative group w-16 h-16 rounded-full overflow-hidden border-2 border-purple-600 hover:border-purple-400 transition-colors"
        >
          <img
            src={ANTHONY_AVATAR_SM}
            alt="Anthony the Vim Master"
            className="w-full h-full object-cover cursor-pointer"
          />
          <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/20 transition-colors" />
        </button>
        <div>
          <h2 className="font-fantasy text-purple-300 font-bold text-sm">Anthony</h2>
          <p className="text-xs text-gray-500">Vim Master</p>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8"
          onClick={() => setShowAvatarModal(false)}
        >
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setShowAvatarModal(false)}
              className="absolute -top-10 right-0 text-gray-400 hover:text-white transition-colors text-2xl"
            >
              &times;
            </button>
            <img
              src={ANTHONY_AVATAR_LG}
              alt="Anthony the Vim Master"
              className="w-full rounded-lg shadow-2xl border-4 border-purple-600"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="text-center mt-4">
              <h2 className="font-fantasy text-2xl text-purple-300 font-bold">Anthony</h2>
              <p className="text-gray-400">The Grand Wizard of Vim</p>
            </div>
            <p className="text-center text-gray-500 text-xs mt-4">Click anywhere to close</p>
          </div>
        </div>
      )}

      {/* Level Info */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Level {level.id}</span>
          {isLevelComplete && (
            <span className="text-xs text-green-400 font-bold">Complete</span>
          )}
        </div>
        <h3 className="font-fantasy text-purple-200 font-bold">{level.title}</h3>
      </div>

      {/* Objective */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3">
        <h4 className="text-xs text-purple-400 uppercase tracking-wide mb-2 font-bold">Objective</h4>
        <p className="text-sm text-gray-300 leading-relaxed">{level.description}</p>
      </div>

      {/* Hints */}
      {level.hints && level.hints.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3">
          <h4 className="text-xs text-purple-400 uppercase tracking-wide mb-2 font-bold">Hints</h4>
          <ul className="space-y-1">
            {level.hints.map((hint, idx) => (
              <li key={idx} className="text-sm text-gray-400 font-mono flex items-start gap-2">
                <span className="text-purple-500">-</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cheat Sheets */}
      <CheatSheets />

      {/* Wizard Message (current dialogue) */}
      <div className="bg-purple-900/30 rounded-lg border border-purple-800/50 p-3 mt-auto">
        <p className="text-sm text-purple-200 italic leading-relaxed">"{wizardMessage}"</p>
      </div>
    </aside>
  );
};

export default LeftSidebar;
