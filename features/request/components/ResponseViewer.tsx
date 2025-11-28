import React from 'react';
import { Cpu } from 'lucide-react';
import { SimulatedResponse } from '../../../shared/types';
import { CodeBlock } from '../../../shared/ui/CodeBlock';
import { TerminalLogs } from '../../../shared/ui/TerminalLogs';
import { ResponseTable } from '../../../shared/ui/ResponseTable';

interface ResponseViewerProps {
  response: SimulatedResponse | null;
  rightTab: 'BODY' | 'HEADERS' | 'LOGS' | 'TABLE';
  responseLanguage: 'json' | 'xml' | 'graphql';
  onRightTabChange: (tab: 'BODY' | 'HEADERS' | 'LOGS' | 'TABLE') => void;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  rightTab,
  responseLanguage,
  onRightTabChange
}) => {
  const getStatusColor = (status: number) => {
    if (status >= 500) return 'text-lab-red border-lab-red bg-lab-red/10';
    if (status >= 400) return 'text-lab-orange border-lab-orange bg-lab-orange/10';
    if (status >= 200) return 'text-lab-green border-lab-green bg-lab-green/10';
    return 'text-lab-textMuted';
  };

  if (!response) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-lab-textMuted/40 gap-2">
        <Cpu className="w-12 h-12 animate-pulse opacity-50" />
        <span className="text-xs font-mono tracking-widest">READY_FOR_TRANSMISSION</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between px-2 border-b border-lab-border bg-lab-bgDim/30 backdrop-blur-sm shrink-0 h-10 overflow-x-auto no-scrollbar">
        <div className="flex h-full shrink-0">
          <button
            onClick={() => onRightTabChange('BODY')}
            className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${
              rightTab === 'BODY'
                ? 'border-lab-blueAqua text-lab-blueAqua'
                : 'border-transparent text-lab-textMuted hover:text-lab-text'
            }`}
          >
            {responseLanguage === 'xml' ? 'XML' : 'JSON'}
          </button>
          <button
            onClick={() => onRightTabChange('TABLE')}
            className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${
              rightTab === 'TABLE'
                ? 'border-lab-blueAqua text-lab-blueAqua'
                : 'border-transparent text-lab-textMuted hover:text-lab-text'
            }`}
          >
            TABLE
          </button>
          <button
            onClick={() => onRightTabChange('LOGS')}
            className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${
              rightTab === 'LOGS'
                ? 'border-lab-blueAqua text-lab-blueAqua'
                : 'border-transparent text-lab-textMuted hover:text-lab-text'
            }`}
          >
            LOGS
          </button>
          <button
            onClick={() => onRightTabChange('HEADERS')}
            className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${
              rightTab === 'HEADERS'
                ? 'border-lab-blueAqua text-lab-blueAqua'
                : 'border-transparent text-lab-textMuted hover:text-lab-text'
            }`}
          >
            HEADERS
          </button>
        </div>
        <div className={`ml-4 shrink-0 text-xs font-mono px-2 py-0.5 rounded border ${getStatusColor(response.status)}`}>
          {response.status} {response.statusText} ({response.latency}ms)
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-lab-bg relative">
        {rightTab === 'BODY' && <CodeBlock code={response.body} language={responseLanguage} />}
        {rightTab === 'TABLE' && <ResponseTable data={response.body} />}
        {rightTab === 'LOGS' && <TerminalLogs logs={response.logs} sql={response.sql} />}
        {rightTab === 'HEADERS' && <CodeBlock code={response.headers} language="json" />}
      </div>
    </>
  );
};
