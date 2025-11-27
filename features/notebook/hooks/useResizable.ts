
import { useState, useRef, useEffect } from 'react';

export const useResizable = (initialWidthStr: string | null) => {
  const [containerWidth, setContainerWidth] = useState<number | string>(() => {
    // Mobile Check on Initialization
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return '100%';
    }

    if (initialWidthStr) {
        const parsed = parseInt(initialWidthStr);
        if (!isNaN(parsed) && parsed > 300) return parsed;
    }
    return 1024;
  });

  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const resizeRef = useRef<{ startX: number, startWidth: number } | null>(null);

  const startResize = (direction: 'left' | 'right', e: React.MouseEvent) => {
    // Disable resizing if we are in mobile mode (string width)
    if (typeof containerWidth === 'string') return;
    
    e.preventDefault();
    setIsResizing(direction);
    resizeRef.current = { startX: e.clientX, startWidth: containerWidth as number };
    document.body.style.cursor = 'ew-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return;

      const { startX, startWidth } = resizeRef.current;
      const currentX = e.clientX;
      let delta = 0;

      // Symmetric resizing for centered container
      if (isResizing === 'right') {
        delta = (currentX - startX) * 2;
      } else {
        delta = (startX - currentX) * 2;
      }

      const newWidth = Math.max(600, Math.min(startWidth + delta, window.innerWidth * 0.98));
      setContainerWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      resizeRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Optional: Listen for window resize to switch to mobile mode if needed, 
  // but for simplicity we assume the initial check covers most load cases.
  // A robust app would use a window resize listener here.
  useEffect(() => {
      const handleWindowResize = () => {
          if (window.innerWidth < 768) {
              setContainerWidth('100%');
          } else {
              // Only revert to default if currently 100% string
              setContainerWidth(prev => prev === '100%' ? 1024 : prev);
          }
      };
      window.addEventListener('resize', handleWindowResize);
      return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return { containerWidth, isResizing, startResize };
};