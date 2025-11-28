import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface EnvironmentIndicatorProps {
  fullUrl: string;
}

export const EnvironmentIndicator: React.FC<EnvironmentIndicatorProps> = ({ fullUrl }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-1 px-2 py-1 bg-lab-purple/10 rounded text-lab-purple text-xs font-mono font-bold cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Globe className="w-3 h-3" />
        ENV
      </div>

      {showTooltip && (
        <div className="absolute z-50 top-full mt-2 left-1/2 transform -translate-x-1/2 bg-lab-bgDim border border-lab-border rounded shadow-xl px-3 py-2 min-w-[200px] max-w-[400px] animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="text-xs font-mono text-lab-textMuted mb-1">Full URL:</div>
          <div className="text-xs font-mono text-lab-blueAqua break-all">{fullUrl}</div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-lab-bgDim border-t border-l border-lab-border rotate-45"></div>
        </div>
      )}
    </div>
  );
};
