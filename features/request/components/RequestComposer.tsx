import React from 'react';
import { Code, List, Trash2, AlertCircle } from 'lucide-react';
import { RequestConfig } from '../types';
import { JsonEditor } from '../../../shared/ui/JsonEditor';

interface RequestComposerProps {
  config: RequestConfig;
  leftTab: 'BODY' | 'HEADERS';
  inputMode: 'RAW' | 'FORM';
  formRows: { id: string; key: string; value: string }[];
  jsonError: string | null;
  readOnly?: boolean;
  requestLanguage: 'json' | 'xml' | 'graphql';
  onLeftTabChange: (tab: 'BODY' | 'HEADERS') => void;
  onInputModeChange: (mode: 'RAW' | 'FORM') => void;
  onBodyChange: (value: string) => void;
  onHeadersChange: (value: string) => void;
  onModeSwitch: (mode: 'REST' | 'GRAPHQL' | 'SOAP') => void;
  onFormChange: (id: string, field: 'key' | 'value', newValue: string) => void;
  onAddFormRow: () => void;
  onRemoveFormRow: (id: string) => void;
}

export const RequestComposer: React.FC<RequestComposerProps> = ({
  config,
  leftTab,
  inputMode,
  formRows,
  jsonError,
  readOnly,
  requestLanguage,
  onLeftTabChange,
  onInputModeChange,
  onBodyChange,
  onHeadersChange,
  onModeSwitch,
  onFormChange,
  onAddFormRow,
  onRemoveFormRow
}) => {
  return (
    <div className="flex-col lg:flex-1 flex min-w-0 h-[400px] lg:h-auto bg-lab-bg/50">
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-2 border-b border-lab-border bg-lab-bgDim/30 backdrop-blur-sm shrink-0 h-10 overflow-x-auto no-scrollbar">
        <div className="flex h-full shrink-0">
          <button
            onClick={() => onLeftTabChange('BODY')}
            className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${
              leftTab === 'BODY'
                ? 'border-lab-blueAqua text-lab-blueAqua'
                : 'border-transparent text-lab-textMuted hover:text-lab-text'
            }`}
          >
            BODY
          </button>
          <button
            onClick={() => onLeftTabChange('HEADERS')}
            className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${
              leftTab === 'HEADERS'
                ? 'border-lab-blueAqua text-lab-blueAqua'
                : 'border-transparent text-lab-textMuted hover:text-lab-text'
            }`}
          >
            HEADERS
          </button>
        </div>

        <div className="flex items-center shrink-0 ml-4">
          {/* Form/Raw Toggle only for Body + REST */}
          {leftTab === 'BODY' && config.mode === 'REST' && (
            <div className="flex scale-90 bg-lab-bg rounded border border-lab-border group mr-2">
              <button
                onClick={() => onInputModeChange('RAW')}
                className={`p-1 px-2 border-r border-lab-border ${
                  inputMode === 'RAW' ? 'text-lab-text bg-lab-border/30' : 'text-lab-textMuted hover:text-lab-text'
                }`}
              >
                <Code className="w-3 h-3" />
              </button>
              <button
                onClick={() => onInputModeChange('FORM')}
                className={`p-1 px-2 ${
                  inputMode === 'FORM' ? 'text-lab-text bg-lab-border/30' : 'text-lab-textMuted hover:text-lab-text'
                }`}
              >
                <List className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Mode Selector */}
          {readOnly ? (
            <div className="flex scale-90">
              <span
                className={`px-2 py-1 text-xs font-bold rounded border border-lab-border ${
                  config.mode === 'REST'
                    ? 'text-lab-blue bg-lab-blue/10'
                    : config.mode === 'GRAPHQL'
                    ? 'text-lab-purple bg-lab-purple/10'
                    : 'text-lab-orange bg-lab-orange/10'
                }`}
              >
                {config.mode === 'GRAPHQL' ? 'GQL' : config.mode}
              </span>
            </div>
          ) : (
            <div className="flex scale-90 bg-lab-bg rounded border border-lab-border">
              <button
                onClick={() => onModeSwitch('REST')}
                className={`px-2 py-1 text-xs font-bold border-r border-lab-border transition-colors ${
                  config.mode === 'REST' ? 'text-lab-blue bg-lab-blue/10' : 'text-lab-textMuted'
                }`}
              >
                REST
              </button>
              <button
                onClick={() => onModeSwitch('GRAPHQL')}
                className={`px-2 py-1 text-xs font-bold border-r border-lab-border transition-colors ${
                  config.mode === 'GRAPHQL' ? 'text-lab-purple bg-lab-purple/10' : 'text-lab-textMuted'
                }`}
              >
                GQL
              </button>
              <button
                onClick={() => onModeSwitch('SOAP')}
                className={`px-2 py-1 text-xs font-bold transition-colors ${
                  config.mode === 'SOAP' ? 'text-lab-orange bg-lab-orange/10' : 'text-lab-textMuted'
                }`}
              >
                SOAP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-0 relative overflow-hidden">
        {leftTab === 'BODY' ? (
          inputMode === 'RAW' ? (
            <div className="relative w-full h-full group">
              <JsonEditor
                value={config.body}
                onChange={onBodyChange}
                hasError={!!jsonError}
                language={requestLanguage}
              />
              {jsonError && (
                <div className="absolute bottom-2 right-2 left-2 z-20 pointer-events-none">
                  <div className="flex items-center gap-2 bg-lab-bgDim border border-lab-red/50 text-lab-red text-xs px-3 py-2 rounded shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-1 max-w-full">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span className="truncate font-mono">{jsonError}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-2 overflow-y-auto h-full bg-lab-codeBg custom-scrollbar">
              {formRows.map((row) => (
                <div key={row.id} className="flex gap-2 items-center group">
                  <input
                    className="flex-1 bg-lab-bg border border-lab-border focus:border-lab-blueAqua text-lab-blueAqua text-sm p-1.5 rounded font-mono outline-none transition-colors"
                    value={row.key}
                    onChange={(e) => onFormChange(row.id, 'key', e.target.value)}
                    placeholder="Key"
                  />
                  <span className="text-lab-textMuted">:</span>
                  <input
                    className="flex-[2] bg-lab-bg border border-lab-border focus:border-lab-blueAqua text-lab-text text-sm p-1.5 rounded font-mono outline-none transition-colors"
                    value={row.value}
                    onChange={(e) => onFormChange(row.id, 'value', e.target.value)}
                    placeholder="Value"
                  />
                  <button
                    onClick={() => onRemoveFormRow(row.id)}
                    className="text-lab-textMuted hover:text-lab-red opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={onAddFormRow}
                className="w-full py-1 border border-dashed border-lab-border text-lab-textMuted hover:text-lab-green hover:border-lab-green text-xs font-mono mt-2 transition-all"
              >
                + ADD FIELD
              </button>
            </div>
          )
        ) : (
          // HEADERS TAB
          <JsonEditor
            value={config.headers}
            onChange={onHeadersChange}
            placeholder='{ "Content-Type": "application/json" }'
            language="json"
          />
        )}
      </div>
    </div>
  );
};
