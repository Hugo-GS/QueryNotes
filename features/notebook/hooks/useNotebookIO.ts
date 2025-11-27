
import { useState, useRef, useCallback } from 'react';
import { NotebookCell } from '../types';

interface UseNotebookIOProps {
  setCells: (cells: NotebookCell[]) => void;
  forceCollapse: boolean;
}

export const useNotebookIO = ({ setCells, forceCollapse }: UseNotebookIOProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processLoadedCells = useCallback((data: NotebookCell[]): NotebookCell[] => {
      if (forceCollapse) {
          return data.map(cell => ({ ...cell, isExpanded: false }));
      }
      return data;
  }, [forceCollapse]);

  const validateNotebookData = useCallback((data: any): boolean => {
    if (!Array.isArray(data)) return false;
    return data.every(item => item.id && item.type && (item.content !== undefined || item.requestConfig !== undefined));
  }, []);

  const handleDownload = useCallback((cells: NotebookCell[]) => {
    const data = JSON.stringify(cells, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notebook-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (validateNotebookData(json)) {
          setCells(processLoadedCells(json));
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
  }, [validateNotebookData, setCells, processLoadedCells]);

  const loadFromUrl = useCallback(async (url: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      if (validateNotebookData(json)) {
        setCells(processLoadedCells(json));
      } else {
        alert("Invalid Notebook JSON format received from URL.");
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to load notebook from URL: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [validateNotebookData, setCells, processLoadedCells]);

  return {
    isLoading,
    fileInputRef,
    handleDownload,
    handleFileSelect,
    loadFromUrl
  };
};
