
import { useState, useRef, useCallback } from 'react';
import { NotebookCell } from '../types';

interface NotebookData {
  cells: NotebookCell[];
  environmentUrl?: string;
}

interface UseNotebookIOProps {
  setCells: (cells: NotebookCell[]) => void;
  environmentUrl: string;
  setEnvironmentUrl: (url: string) => void;
  forceCollapse: boolean;
}

export const useNotebookIO = ({ setCells, environmentUrl, setEnvironmentUrl, forceCollapse }: UseNotebookIOProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processLoadedCells = useCallback((data: NotebookCell[]): NotebookCell[] => {
      if (forceCollapse) {
          return data.map(cell => ({ ...cell, isExpanded: false }));
      }
      return data;
  }, [forceCollapse]);

  const validateNotebookData = useCallback((data: any): boolean => {
    // Support both old format (array of cells) and new format (object with cells + environmentUrl)
    if (Array.isArray(data)) {
      // Old format: array of cells
      return data.every(item => item.id && item.type && (item.content !== undefined || item.requestConfig !== undefined));
    } else if (data && typeof data === 'object' && Array.isArray(data.cells)) {
      // New format: object with cells array
      return data.cells.every((item: any) => item.id && item.type && (item.content !== undefined || item.requestConfig !== undefined));
    }
    return false;
  }, []);

  const handleDownload = useCallback((cells: NotebookCell[]) => {
    const notebookData: NotebookData = {
      cells,
      environmentUrl: environmentUrl || undefined
    };
    const data = JSON.stringify(notebookData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notebook-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [environmentUrl]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (validateNotebookData(json)) {
          // Handle both old format (array) and new format (object with cells)
          if (Array.isArray(json)) {
            // Old format: just cells array
            setCells(processLoadedCells(json));
            setEnvironmentUrl('');
          } else {
            // New format: object with cells and environmentUrl
            setCells(processLoadedCells(json.cells));
            setEnvironmentUrl(json.environmentUrl || '');
          }
        } else {
          alert("Invalid Notebook JSON format.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset
      }
    };
    reader.readAsText(file);
  }, [validateNotebookData, setCells, setEnvironmentUrl, processLoadedCells]);

  const loadFromUrl = useCallback(async (url: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      if (validateNotebookData(json)) {
        // Handle both old format (array) and new format (object with cells)
        if (Array.isArray(json)) {
          // Old format: just cells array
          setCells(processLoadedCells(json));
          setEnvironmentUrl('');
        } else {
          // New format: object with cells and environmentUrl
          setCells(processLoadedCells(json.cells));
          setEnvironmentUrl(json.environmentUrl || '');
        }
      } else {
        alert("Invalid Notebook JSON format received from URL.");
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to load notebook from URL: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [validateNotebookData, setCells, setEnvironmentUrl, processLoadedCells]);

  return {
    isLoading,
    fileInputRef,
    handleDownload,
    handleFileSelect,
    loadFromUrl
  };
};
