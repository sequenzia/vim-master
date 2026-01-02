import React, { useState } from 'react';

interface CheatSheet {
  id: string;
  title: string;
  url: string;
}

const CHEAT_SHEETS: CheatSheet[] = [
  {
    id: 'normal',
    title: 'Normal Mode',
    url: 'https://storage.googleapis.com/sequenzia-public/assets/images/vim/vim_normal_mode.jpeg'
  },
  {
    id: 'insert',
    title: 'Insert Mode',
    url: 'https://storage.googleapis.com/sequenzia-public/assets/images/vim/vim_insert_mode.jpeg'
  },
  {
    id: 'visual',
    title: 'Visual Mode',
    url: 'https://storage.googleapis.com/sequenzia-public/assets/images/vim/vim_visual_mode.jpeg'
  },
  {
    id: 'cmdline',
    title: 'Command Line',
    url: 'https://storage.googleapis.com/sequenzia-public/assets/images/vim/vim_cmdline_mode.jpeg'
  }
];

const CheatSheets: React.FC = () => {
  const [selectedSheet, setSelectedSheet] = useState<CheatSheet | null>(null);

  return (
    <>
      {/* Thumbnails */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3">
        <h4 className="text-xs text-purple-400 uppercase tracking-wide mb-2 font-bold">Cheat Sheets</h4>
        <div className="grid grid-cols-2 gap-2">
          {CHEAT_SHEETS.map((sheet) => (
            <button
              key={sheet.id}
              onClick={() => setSelectedSheet(sheet)}
              className="group relative aspect-[4/3] rounded overflow-hidden border border-gray-600 hover:border-purple-500 transition-colors"
            >
              <img
                src={sheet.url}
                alt={sheet.title}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1.5">
                <span className="text-[10px] text-gray-300 font-mono truncate">{sheet.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Full Screen Modal */}
      {selectedSheet && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedSheet(null)}
        >
          <div className="relative max-w-6xl max-h-full w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="font-fantasy text-xl text-purple-300">{selectedSheet.title}</h2>
              <button
                onClick={() => setSelectedSheet(null)}
                className="text-gray-400 hover:text-white transition-colors text-2xl px-2"
              >
                &times;
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <img
                src={selectedSheet.url}
                alt={selectedSheet.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-2 mt-4 shrink-0">
              {CHEAT_SHEETS.map((sheet) => (
                <button
                  key={sheet.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSheet(sheet);
                  }}
                  className={`px-3 py-1.5 rounded text-sm font-mono transition-colors ${
                    sheet.id === selectedSheet.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {sheet.title}
                </button>
              ))}
            </div>

            <p className="text-center text-gray-500 text-xs mt-3">Click anywhere or press Escape to close</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CheatSheets;
