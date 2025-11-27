
import { useMemo } from 'react';

export interface AppConfig {
  initialTheme: 'dark' | 'light';
  isPresentationMode: boolean;
  notebookUrl: string | null;
  cellWidth: string | null;
  collapseCells: boolean;
}

export const useAppQuery = (): AppConfig => {
  const config = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Theme
    const themeParam = params.get('theme');
    const initialTheme = (themeParam === 'light' || themeParam === 'dark') ? (themeParam as 'dark' | 'light') : 'dark';

    // Presentation / Read Only Mode
    // specific 'readOnly' or 'hideEditButtons' also trigger presentation mode logic
    const isPresentationMode = 
      params.get('presentation') === 'true' || 
      params.get('readOnly') === 'true' || 
      params.get('hideEditButtons') === 'true';

    // Notebook URL (supports 'notebook' or 'notebookUrl')
    const notebookUrl = params.get('notebook') || params.get('notebookUrl');

    // Layout config
    const cellWidth = params.get('cellWidth');
    const collapseCells = params.get('collapseCells') === 'true';

    return {
      initialTheme,
      isPresentationMode,
      notebookUrl,
      cellWidth,
      collapseCells
    };
  }, []);

  return config;
};
