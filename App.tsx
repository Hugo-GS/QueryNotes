
import * as React from 'react';
import { useState } from 'react';
import { Notebook } from './features/notebook/Notebook';
import { useTheme } from './shared/hooks/useTheme';
import { useAppQuery } from './shared/hooks/useAppQuery';
import { Header } from './shared/ui/Header';

const App: React.FC = () => {
  // 1. Parse URL Config
  const appConfig = useAppQuery();

  // 2. Initialize Global State
  const { theme, toggleTheme } = useTheme(() => appConfig.initialTheme);
  const [presentationMode, setPresentationMode] = useState(() => appConfig.isPresentationMode);

  return (
    <div className="lab-grid min-h-screen w-full flex flex-col relative">
      
      {/* --- Sticky Header (Hidden in Presentation Mode) --- */}
      {!presentationMode && (
        <Header 
          theme={theme}
          toggleTheme={toggleTheme}
          isPresentationMode={presentationMode}
          togglePresentationMode={() => setPresentationMode(!presentationMode)}
        />
      )}

      {/* --- Notebook Content --- */}
      <main className={`flex-1 w-full relative z-10 ${presentationMode ? 'pt-4' : ''}`}>
        <Notebook 
            isPresentationMode={presentationMode} 
            initialUrl={appConfig.notebookUrl}
            initialWidth={appConfig.cellWidth}
            forceCollapse={appConfig.collapseCells}
        />
      </main>

    </div>
  );
};

export default App;
