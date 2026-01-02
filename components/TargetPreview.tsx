import React from 'react';
import { Cursor } from '../types';

interface TargetPreviewProps {
  targetText: string[] | ((buffer: string[], cursor: Cursor) => boolean);
  currentBuffer: string[];
  isComplete: boolean;
}

const TargetPreview: React.FC<TargetPreviewProps> = ({ targetText, currentBuffer, isComplete }) => {
  if (isComplete) return null;

  // Handle function-based targets (cursor position goals)
  if (typeof targetText === 'function') {
    return (
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3">
        <h4 className="text-xs text-teal-400 uppercase tracking-wide mb-2 font-bold flex items-center gap-2">
          <span>Goal</span>
        </h4>
        <p className="text-sm text-gray-400 font-mono">
          Move cursor to the target position
        </p>
      </div>
    );
  }

  // Handle array-based targets (text comparison)
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3">
      <h4 className="text-xs text-teal-400 uppercase tracking-wide mb-2 font-bold">
        Expected Result
      </h4>
      <div className="font-mono text-sm space-y-0.5">
        {targetText.map((line, idx) => {
          const currentLine = currentBuffer[idx] || '';
          const isMatch = line === currentLine;
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 ${isMatch ? 'text-green-400' : 'text-gray-300'}`}
            >
              <span className="text-gray-600 w-4 text-right select-none">{idx + 1}</span>
              <span className={isMatch ? 'opacity-60' : ''}>{line || '\u00A0'}</span>
              {isMatch && <span className="text-green-500 text-xs ml-auto">ok</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TargetPreview;
