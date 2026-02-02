
import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface ContextMenuItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  separator?: boolean;
  children?: ContextMenuItem[];
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

interface SubMenuProps {
  items: ContextMenuItem[];
  parentRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ items, parentRef, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (parentRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Estimate menu size (will be adjusted after render if needed)
      const estimatedWidth = 180;
      const estimatedHeight = items.length * 36;

      let left = parentRect.right - 4;
      let top = parentRect.top;

      // Check if submenu overflows right edge
      if (left + estimatedWidth > viewportWidth) {
        left = parentRect.left - estimatedWidth + 4;
      }

      // Check if submenu overflows bottom edge
      if (top + estimatedHeight > viewportHeight) {
        top = Math.max(8, viewportHeight - estimatedHeight - 8);
      }

      setPosition({ top, left });
    }
  }, [parentRef, items.length]);

  // Don't render until position is calculated
  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[101] min-w-[180px] bg-lab-bgDim border border-lab-border rounded-md shadow-2xl overflow-hidden animate-in fade-in duration-75"
      style={{ top: position.top, left: position.left }}
    >
      <div className="py-1">
        {items.map((item, index) => (
          item.separator ? (
            <div key={index} className="my-1 border-t border-lab-border" />
          ) : (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick?.();
                onClose();
              }}
              className={`w-full text-left px-4 py-2 text-xs font-mono font-bold flex items-center gap-3 hover:bg-lab-bg transition-colors [&_svg]:w-3.5 [&_svg]:h-3.5 ${
                item.danger ? 'text-lab-red hover:bg-lab-red/10' : 'text-lab-text hover:text-lab-blueAqua'
              }`}
            >
              {item.icon && <span className="w-3.5 h-3.5 flex items-center justify-center opacity-70">{item.icon}</span>}
              {item.label}
            </button>
          )
        ))}
      </div>
    </div>
  );
};

interface MenuItemWithSubmenuProps {
  item: ContextMenuItem;
  onClose: () => void;
}

const MenuItemWithSubmenu: React.FC<MenuItemWithSubmenuProps> = ({ item, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={buttonRef}
        className="w-full text-left px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-3 hover:bg-lab-bg transition-colors text-lab-text hover:text-lab-blueAqua [&_svg]:w-3.5 [&_svg]:h-3.5"
      >
        {item.icon && <span className="w-3.5 h-3.5 flex items-center justify-center opacity-70">{item.icon}</span>}
        <span className="flex-1">{item.label}</span>
        <ChevronRight className="w-3 h-3 opacity-50" />
      </button>
      {isOpen && item.children && (
        <SubMenu items={item.children} parentRef={buttonRef} onClose={onClose} />
      )}
    </div>
  );
};

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

  // Adjust position if it overflows viewport
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
          item.separator ? (
            <div key={index} className="my-1 border-t border-lab-border" />
          ) : item.children ? (
            <MenuItemWithSubmenu key={index} item={item} onClose={onClose} />
          ) : (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick?.();
                onClose();
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-3 hover:bg-lab-bg transition-colors [&_svg]:w-3.5 [&_svg]:h-3.5 ${
                item.danger ? 'text-lab-red hover:bg-lab-red/10' : 'text-lab-text hover:text-lab-blueAqua'
              }`}
            >
              {item.icon && <span className="w-3.5 h-3.5 flex items-center justify-center opacity-70">{item.icon}</span>}
              {item.label}
            </button>
          )
        ))}
      </div>
    </div>
  );
};
