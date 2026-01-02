import React, { useState } from 'react';
import { ANTHONY_IMAGE_URL } from '../constants';

interface WizardProps {
  message: string;
  emotion: string;
}

const Wizard: React.FC<WizardProps> = ({ message, emotion }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-start gap-4 p-4 bg-gray-900/80 rounded-xl border border-purple-800 backdrop-blur-sm max-w-3xl mx-auto mt-4 animate-fade-in-up">
        <div 
          className="relative group shrink-0 cursor-pointer" 
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsModalOpen(true);
            }
          }}
          aria-label="View full size wizard avatar"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative w-24 h-24 rounded-full border-2 border-purple-500 overflow-hidden bg-gray-900">
            <img 
              src={ANTHONY_IMAGE_URL} 
              alt="Anthony the Vim Master" 
              className="w-full h-full object-cover object-top scale-150 translate-y-6 grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
          
          <div className="absolute bottom-0 right-0 bg-black text-xs text-purple-300 px-1 rounded border border-purple-500 z-10">
            Lvl 99
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-purple-400 font-fantasy text-lg mb-1">Anthony "The Vim Master"</h3>
          <div className="relative bg-gray-800 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border-l-4 border-purple-600">
              <p className="text-gray-300 font-mono text-sm md:text-base leading-relaxed typing-effect">
                 "{message}"
              </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center items-center">
            <img 
              src={ANTHONY_IMAGE_URL} 
              alt="Anthony the Vim Master Full Size" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg border-4 border-purple-600 shadow-[0_0_50px_rgba(147,51,234,0.5)]"
              onClick={(e) => e.stopPropagation()} 
            />
            <button 
              className="absolute -top-12 right-0 md:-right-12 text-gray-400 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Wizard;