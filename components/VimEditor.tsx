'use client';

import React, { useEffect, useRef } from 'react';
import { VimMode, Cursor } from '@/types';

interface VimEditorProps {
  lines: string[];
  cursor: Cursor;
  mode: VimMode;
  onBufferChange: (newLines: string[]) => void;
  onCursorChange: (newCursor: Cursor) => void;
  onModeChange: (newMode: VimMode) => void;
  allowedKeys: string[];
  isLevelComplete: boolean;
}

const VimEditor: React.FC<VimEditorProps> = ({
  lines,
  cursor,
  mode,
  onBufferChange,
  onCursorChange,
  onModeChange,
  allowedKeys,
  isLevelComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus trap for key handling
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [lines, mode]); // Re-focus on meaningful changes

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isLevelComplete) return;

    const { key, ctrlKey } = e;

    // Mode Switching
    if (mode === VimMode.NORMAL) {
      if (key === 'i') {
        onModeChange(VimMode.INSERT);
        e.preventDefault();
        return;
      }
      if (key === 'a') {
        // Append: move cursor right by one, then enter insert mode
        const lineLen = lines[cursor.row].length;
        onCursorChange({ ...cursor, col: Math.min(cursor.col + 1, lineLen) });
        onModeChange(VimMode.INSERT);
        e.preventDefault();
        return;
      }
    } else if (mode === VimMode.INSERT) {
      if (key === 'Escape') {
        onModeChange(VimMode.NORMAL);
        // Move cursor back one on escape (Vim behavior)
        onCursorChange({ ...cursor, col: Math.max(0, cursor.col - 1) });
        e.preventDefault();
        return;
      }
    }

    // Normal Mode Navigation & Actions
    if (mode === VimMode.NORMAL) {
      e.preventDefault(); // Prevent scrolling/browser shortcuts in normal mode
      let newCursor = { ...cursor };
      const currentLineLen = lines[newCursor.row].length;

      switch (key) {
        case 'h':
          newCursor.col = Math.max(0, newCursor.col - 1);
          break;
        case 'l':
          newCursor.col = Math.min(currentLineLen - 1, newCursor.col + 1);
          break;
        case 'j':
          newCursor.row = Math.min(lines.length - 1, newCursor.row + 1);
          // Clamp col to new line length
          newCursor.col = Math.min(newCursor.col, Math.max(0, lines[newCursor.row].length - 1));
          break;
        case 'k':
          newCursor.row = Math.max(0, newCursor.row - 1);
          newCursor.col = Math.min(newCursor.col, Math.max(0, lines[newCursor.row].length - 1));
          break;
        case 'w':
            // Simple word jump forward (space delimited for simplicity in game)
            // Look ahead for next space or end of line
            {
               const line = lines[newCursor.row];
               let c = newCursor.col + 1;
               // Skip current word chars
               while(c < line.length && line[c] !== ' ') c++;
               // Skip spaces
               while(c < line.length && line[c] === ' ') c++;
               if (c < line.length) {
                   newCursor.col = c;
               } else if (newCursor.row < lines.length - 1) {
                   newCursor.row++;
                   newCursor.col = 0;
                    // Skip leading spaces on next line
                   while(newCursor.col < lines[newCursor.row].length && lines[newCursor.row][newCursor.col] === ' ') newCursor.col++;
               }
            }
            break;
        case 'b':
            // Simple word jump back
            {
                const line = lines[newCursor.row];
                let c = newCursor.col - 1;
                 // Skip spaces if we are on one or just started
                while(c >= 0 && line[c] === ' ') c--;
                // Go to start of word
                while(c > 0 && line[c-1] !== ' ') c--;
                
                if (c >= 0) {
                    newCursor.col = c;
                } else if (newCursor.row > 0) {
                    newCursor.row--;
                    newCursor.col = lines[newCursor.row].length - 1;
                }
            }
            break;
        case 'x':
          // Delete character
          if (lines[newCursor.row].length > 0) {
            const newLine = lines[newCursor.row].slice(0, newCursor.col) + lines[newCursor.row].slice(newCursor.col + 1);
            const newLines = [...lines];
            newLines[newCursor.row] = newLine;
            onBufferChange(newLines);
            // Adjust cursor if at end
            if (newCursor.col >= newLine.length && newLine.length > 0) {
              newCursor.col = newLine.length - 1;
            } else if (newLine.length === 0) {
                newCursor.col = 0;
            }
          }
          break;
        case '$':
            newCursor.col = Math.max(0, lines[newCursor.row].length - 1);
            break;
        case '0':
            newCursor.col = 0;
            break;
      }
      onCursorChange(newCursor);
    }

    // Insert Mode Typing
    if (mode === VimMode.INSERT) {
      // Allow default behavior for some keys, capture others
      if (key.length === 1 && !ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        const line = lines[cursor.row];
        const newLine = line.slice(0, cursor.col) + key + line.slice(cursor.col);
        const newLines = [...lines];
        newLines[cursor.row] = newLine;
        onBufferChange(newLines);
        onCursorChange({ ...cursor, col: cursor.col + 1 });
      } else if (key === 'Backspace') {
        e.preventDefault();
        if (cursor.col > 0) {
          const line = lines[cursor.row];
          const newLine = line.slice(0, cursor.col - 1) + line.slice(cursor.col);
          const newLines = [...lines];
          newLines[cursor.row] = newLine;
          onBufferChange(newLines);
          onCursorChange({ ...cursor, col: cursor.col - 1 });
        }
      } else if (key === 'Enter') {
          e.preventDefault();
          // Break line
          const currentLine = lines[cursor.row];
          const firstPart = currentLine.slice(0, cursor.col);
          const secondPart = currentLine.slice(cursor.col);
          const newLines = [...lines];
          newLines.splice(cursor.row, 1, firstPart, secondPart);
          onBufferChange(newLines);
          onCursorChange({ row: cursor.row + 1, col: 0 });
      }
    }
  };

  return (
    <div
      className="relative w-full h-full flex flex-col bg-black border-2 border-gray-700 rounded-lg overflow-hidden shadow-xl"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={containerRef}
    >
      {/* Title Bar */}
      <div className="bg-neutral-800 text-gray-400 px-4 py-1 text-xs flex justify-between font-mono">
        <span>ANTHONY_VIM_TRAINER.exe</span>
        <span>{mode} -- {lines.length}L, {lines.join('').length}C</span>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-4 font-mono text-lg leading-relaxed text-vim-fg overflow-y-auto">
        {lines.map((line, rowIndex) => (
          <div key={rowIndex} className="flex relative">
            {/* Line Numbers */}
            <div className="w-8 text-right mr-4 text-gray-600 select-none">
              {rowIndex + 1}
            </div>
            
            {/* Line Content */}
            <div className="flex-1 whitespace-pre break-all relative">
              {line.length === 0 && rowIndex === cursor.row ? (
                 // Render block cursor on empty line
                 <span className={`inline-block w-2.5 h-6 align-middle ${mode === VimMode.NORMAL ? 'bg-fuchsia-400 opacity-80' : 'border-l-2 border-white'}`}>&nbsp;</span>
              ) : (
                line.split('').map((char, colIndex) => {
                  const isCursor = rowIndex === cursor.row && colIndex === cursor.col;
                  // If we are in Insert mode and at the end of the line, the cursor might be *after* the last char
                  return (
                    <span 
                      key={colIndex}
                      className={`${isCursor && mode === VimMode.NORMAL ? 'bg-fuchsia-400 text-black' : ''} ${isCursor && mode === VimMode.INSERT ? 'border-l-2 border-white' : ''}`}
                    >
                      {char}
                    </span>
                  );
                })
              )}
              {/* Cursor at very end of line for Insert mode or if line is not empty but cursor is at end (Normal mode cursor sits ON char, Insert can sit AFTER) */}
              {mode === VimMode.INSERT && rowIndex === cursor.row && cursor.col === line.length && (
                 <span className="inline-block w-2.5 h-6 align-middle border-l-2 border-white animate-pulse">&nbsp;</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="shrink-0 bg-vim-bar text-white px-3 py-1.5 font-mono text-sm flex justify-between border-t border-gray-700">
        <div className="flex gap-4">
          <span className={`font-bold ${mode === VimMode.NORMAL ? 'text-green-400' : 'text-blue-400'}`}>
            -- {mode} --
          </span>
          <span className="text-gray-400">
            keys: {allowedKeys.join(' ')}
          </span>
        </div>
        <div>
          Ln {cursor.row + 1}, Col {cursor.col + 1}
        </div>
      </div>
    </div>
  );
};

export default VimEditor;
