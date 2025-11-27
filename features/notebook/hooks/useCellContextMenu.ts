
import { useState } from 'react';

export const useCellContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    cellId: string | null;
  }>({ visible: false, x: 0, y: 0, cellId: null });

  const handleContextMenu = (e: React.MouseEvent, cellId: string, isPresentationMode: boolean) => {
    if (isPresentationMode) return;
    
    const target = e.target as HTMLElement;
    // Allow native context menu on inputs/textareas
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
    }

    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      cellId
    });
  };

  const closeContextMenu = () => setContextMenu({ ...contextMenu, visible: false });

  return { contextMenu, handleContextMenu, closeContextMenu };
};
