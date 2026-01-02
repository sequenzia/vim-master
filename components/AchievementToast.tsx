
import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Wait for fade out
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div 
      className={`fixed top-20 right-4 md:right-10 z-[100] transform transition-all duration-500 ease-out ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
       <div className="bg-gray-900 border-2 border-yellow-500 text-white p-4 rounded-lg shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center gap-4 max-w-sm">
          <div className="text-4xl animate-bounce">
            {achievement.icon}
          </div>
          <div>
            <div className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1">Achievement Unlocked</div>
            <h4 className="font-fantasy text-lg text-yellow-100">{achievement.title}</h4>
            <p className="text-xs text-gray-400 font-mono">{achievement.description}</p>
          </div>
       </div>
    </div>
  );
};

export default AchievementToast;
