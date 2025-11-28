import { useState, useEffect } from 'react';

interface UseRequestTabsProps {
  isStacked: boolean;
}

export const useRequestTabs = ({ isStacked }: UseRequestTabsProps) => {
  const [leftTab, setLeftTab] = useState<'BODY' | 'HEADERS'>('BODY');
  const [rightTab, setRightTab] = useState<'BODY' | 'HEADERS' | 'LOGS' | 'TABLE'>('BODY');
  const [inputMode, setInputMode] = useState<'RAW' | 'FORM'>('RAW');

  // Auto-switch to TABLE tab when entering Stacked mode
  useEffect(() => {
    if (isStacked) {
      setRightTab('TABLE');
    }
  }, [isStacked]);

  const switchToAppropriateTab = (status: number) => {
    if (!isStacked) {
      if (status >= 400) {
        setRightTab('LOGS');
      } else {
        setRightTab('BODY');
      }
    }
  };

  return {
    leftTab,
    setLeftTab,
    rightTab,
    setRightTab,
    inputMode,
    setInputMode,
    switchToAppropriateTab
  };
};
