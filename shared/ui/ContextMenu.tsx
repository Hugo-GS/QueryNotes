
import React, { useEffect, useRef } from 'react';

interface ContextMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => onClose();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose]);

  // Adjust position if it overflows viewport (basic implementation)
  const style = {
    top: y,
    left: x,
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-[100] min-w-[200px] bg-lab-bgDim border border-lab-border rounded-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={style}
    >
      <div className="py-1">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
              onClose();
            }}
            className={`w-full text-left px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-3 hover:bg-lab-bg transition-colors [&_svg]:w-3.5 [&_svg]:h-3.5 ${
              item.danger ? 'text-lab-red hover:bg-lab-red/10' : 'text-lab-text hover:text-lab-blueAqua'
            }`}
          >
            {item.icon && <span className="w-3.5 h-3.5 flex items-center justify-center opacity-70">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};