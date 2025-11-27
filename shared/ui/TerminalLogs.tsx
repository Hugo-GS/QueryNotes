
import React from 'react';
import { LogEntry } from '../types';

interface TerminalLogsProps {
  logs: LogEntry[];
  sql?: string;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ logs, sql }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-lab-blue';
      case 'WARN': return 'text-lab-yellow';
      case 'ERROR': return 'text-lab-red';
      case 'DEBUG': return 'text-lab-purple';
      default: return 'text-lab-text';
    }
  };

  return (
    <div className="font-mono text-sm p-4 bg-lab-codeBg border border-lab-border rounded-md h-full overflow-auto transition-colors duration-300">
      {sql && (
        <div className="mb-4 pb-4 border-b border-dashed border-lab-border opacity-90">
          <span className="text-lab-purple font-bold">SQL TRACE:</span>
          <div className="mt-1 text-lab-blueAqua pl-4">
            {'>'} {sql}
          </div>
        </div>
      )}
      
      <div className="flex flex-col space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className="flex space-x-2 border-l-2 border-transparent hover:border-lab-border pl-1 transition-colors">
            <span className="text-lab-textMuted shrink-0 text-xs mt-0.5">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={`font-bold shrink-0 w-14 text-xs mt-0.5 ${getLevelColor(log.level)}`}>{levelToIcon(log.level)} {log.level}</span>
            <span className="text-lab-text break-all">{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-lab-textMuted italic">No logs available...</div>
        )}
      </div>
    </div>
  );
};

const levelToIcon = (level: string) => {
    switch(level) {
        case 'INFO': return 'ℹ';
        case 'WARN': return '⚠';
        case 'ERROR': return '✖';
        case 'DEBUG': return '⚙';
        default: return '';
    }
}
