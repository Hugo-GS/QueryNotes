
import React from 'react';
import { Database, Sun, Moon, Presentation } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  theme, 
  toggleTheme, 
  isPresentationMode, 
  togglePresentationMode 
}) => {
  return (
    <header className="sticky top-0 z-[60] glass-panel border-b border-lab-border px-4 md:px-6 py-3 flex items-center justify-between backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-lab-purple/20 p-1.5 rounded-md border border-lab-purple/50">
          <Database className="w-5 h-5 text-lab-purple" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-lab-text font-mono tracking-wider flex items-center gap-2">
            QueryNote<span className="animate-pulse text-lab-blueAqua">_</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
          <button 
            onClick={togglePresentationMode}
            className={`p-2 rounded-full hover:bg-lab-bgDim transition-colors ${isPresentationMode ? 'text-lab-blueAqua bg-lab-blueAqua/10' : 'text-lab-textMuted hover:text-lab-text'}`}
            title={isPresentationMode ? "Exit Presentation Mode" : "Enter Presentation Mode"}
          >
            <Presentation className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-lab-bgDim text-lab-text hover:text-lab-blueAqua transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
      </div>
    </header>
  );
};