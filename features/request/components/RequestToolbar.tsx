import React from 'react';
import { Play, Clock, ChevronDown, ChevronRight, X } from 'lucide-react';
import { RequestConfig } from '../types';
import { EnvironmentIndicator } from './EnvironmentIndicator';

interface RequestToolbarProps {
  isExpanded: boolean;
  loading: boolean;
  config: RequestConfig;
  readOnly?: boolean;
  environmentUrl?: string;
  onToggleExpand: () => void;
  onConfigChange: (config: RequestConfig) => void;
  onSend: () => void;
  onDelete: () => void;
  getFullUrl: () => string;
}

export const RequestToolbar: React.FC<RequestToolbarProps> = ({
  isExpanded,
  loading,
  config,
  readOnly,
  environmentUrl,
  onToggleExpand,
  onConfigChange,
  onSend,
  onDelete,
  getFullUrl
}) => {
  const showEnvironmentIndicator =
    environmentUrl &&
    !config.endpoint.startsWith('http://') &&
    !config.endpoint.startsWith('https://');

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-lab-bgDim border-b border-lab-border">
      <button onClick={onToggleExpand} className="text-lab-textMuted hover:text-lab-text">
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        <select
          value={config.method}
          onChange={(e) => onConfigChange({ ...config, method: e.target.value as any })}
          disabled={config.mode === 'GRAPHQL' || config.mode === 'SOAP'}
          className={`flex-shrink-0 bg-lab-bg border border-lab-border text-lab-blueAqua font-mono text-sm font-bold py-1.5 px-2 rounded focus:outline-none focus:border-lab-blue ${
            config.mode === 'GRAPHQL' || config.mode === 'SOAP' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={config.endpoint}
          onChange={(e) => onConfigChange({ ...config, endpoint: e.target.value })}
          className="flex-1 min-w-[150px] bg-lab-bg border border-lab-border text-lab-text font-mono text-sm py-1.5 px-3 rounded focus:outline-none focus:border-lab-blue placeholder-lab-textMuted/50"
        />

        {showEnvironmentIndicator && <EnvironmentIndicator fullUrl={getFullUrl()} />}

        <button
          onClick={onSend}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-lab-selection text-lab-blueAqua hover:bg-lab-blue hover:text-lab-bgDim px-4 py-1.5 rounded font-mono text-xs font-bold transition-colors disabled:opacity-50 shadow-lg shadow-lab-selection/20"
        >
          {loading ? <Clock className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
          SEND
        </button>
      </div>

      {!readOnly && (
        <button onClick={onDelete} className="text-lab-textMuted hover:text-lab-red p-1 ml-auto sm:ml-0">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
