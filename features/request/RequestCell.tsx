
import React, { useState, useEffect } from 'react';
import { 
  Play, Clock, Code, List, Trash2, ChevronDown, ChevronRight, X, Cpu, AlertCircle 
} from 'lucide-react';
import { RequestConfig } from './types';
import { SimulatedResponse } from '../../shared/types';
import { simulateBackendRequest } from '../simulation/backend';
import { CodeBlock } from '../../shared/ui/CodeBlock';
import { TerminalLogs } from '../../shared/ui/TerminalLogs';
import { JsonEditor } from '../../shared/ui/JsonEditor';
import { ResponseTable } from '../../shared/ui/ResponseTable';

interface RequestCellProps {
  id: string;
  initialConfig: RequestConfig;
  initialResponse?: SimulatedResponse | null;
  onDelete: () => void;
  onConfigChange?: (config: RequestConfig) => void;
  onResponseChange?: (response: SimulatedResponse | null) => void;
  readOnly?: boolean;
  layout?: 'SPLIT' | 'STACKED';
}

export const RequestCell: React.FC<RequestCellProps> = ({ 
  id, 
  initialConfig, 
  initialResponse,
  onDelete, 
  onConfigChange,
  onResponseChange,
  readOnly, 
  layout = 'SPLIT' 
}) => {
  // -- State --
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<RequestConfig>(initialConfig);
  const [response, setResponse] = useState<SimulatedResponse | null>(initialResponse || null);
  
  // UI State
  const [leftTab, setLeftTab] = useState<'BODY' | 'HEADERS'>('BODY');
  const [rightTab, setRightTab] = useState<'BODY' | 'HEADERS' | 'LOGS' | 'TABLE'>('BODY');
  const [inputMode, setInputMode] = useState<'RAW' | 'FORM'>('RAW'); // For Body only
  const [formRows, setFormRows] = useState<{id: string, key: string, value: string}[]>([]);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const isStacked = layout === 'STACKED';

  // -- State Synchronization --
  // Crucial: Update internal state if parent props change (e.g. loading from file)
  useEffect(() => {
    setResponse(initialResponse || null);
  }, [initialResponse]);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  // Notify parent of config changes
  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  // Auto-switch to TABLE tab when entering Stacked mode
  useEffect(() => {
    if (isStacked) {
      setRightTab('TABLE');
    }
  }, [isStacked]);

  // -- Handlers --

  const handleModeSwitch = (mode: 'REST' | 'GRAPHQL' | 'SOAP') => {
    if (mode === 'GRAPHQL') {
        setConfig(prev => ({
            ...prev,
            mode: 'GRAPHQL',
            method: 'POST',
            endpoint: '/graphql',
            body: prev.mode === 'GRAPHQL' ? prev.body : `query {
  user(id: "123") {
    name
    email
  }
}`,
            headers: '{\n  "Content-Type": "application/json"\n}'
        }));
        setInputMode('RAW');
        setJsonError(null);
    } else if (mode === 'SOAP') {
        setConfig(prev => ({
            ...prev,
            mode: 'SOAP',
            method: 'POST',
            endpoint: '/service/soap-endpoint',
            body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.example.com/webservice">
  <soapenv:Header/>
  <soapenv:Body>
    <web:GetData>
      <web:id>123</web:id>
    </web:GetData>
  </soapenv:Body>
</soapenv:Envelope>`,
            headers: '{\n  "Content-Type": "application/soap+xml"\n}'
        }));
        setInputMode('RAW');
        setJsonError(null);
    } else {
        setConfig(prev => ({
            ...prev,
            mode: 'REST',
            method: 'GET',
            endpoint: '/api/v1/resource',
            body: '{}',
            headers: '{\n  "Content-Type": "application/json"\n}'
        }));
    }
  };

  const handleBodyChange = (value: string) => {
    setConfig({ ...config, body: value });

    // Only validate JSON in REST mode (GraphQL/SOAP has different syntax)
    if (config.mode === 'REST') {
      if (!value.trim()) {
        setJsonError(null);
        return;
      }
      try {
        JSON.parse(value);
        setJsonError(null);
      } catch (e: any) {
        setJsonError(e.message);
      }
    } else {
        setJsonError(null);
    }
  };

  // Form Sync Logic
  const handleFormChange = (id: string, field: 'key' | 'value', newValue: string) => {
    const newRows = formRows.map(row => row.id === id ? { ...row, [field]: newValue } : row);
    setFormRows(newRows);
    
    const obj = newRows.reduce((acc, row) => {
       if (!row.key) return acc;
       return { ...acc, [row.key]: row.value };
    }, {});
    const jsonString = JSON.stringify(obj, null, 2);
    setConfig(prev => ({...prev, body: jsonString}));
    setJsonError(null); // Forms always produce valid JSON
  };

  const addFormRow = () => setFormRows([...formRows, { id: Math.random().toString(), key: '', value: '' }]);
  const removeFormRow = (id: string) => {
      const newRows = formRows.filter(r => r.id !== id);
      setFormRows(newRows);
      const obj = newRows.reduce((acc, row) => {
       if (!row.key) return acc;
       return { ...acc, [row.key]: row.value };
      }, {});
      setConfig(prev => ({...prev, body: JSON.stringify(obj, null, 2)}));
  };

  const handleSend = async () => {
    setLoading(true);
    if (!isExpanded) setIsExpanded(true);
    
    try {
      // Pass headers to the backend function
      const result = await simulateBackendRequest(
          config.mode, 
          config.method, 
          config.endpoint, 
          config.body, 
          config.headers
      );
      
      setResponse(result);
      onResponseChange?.(result);
      
      // Only switch tab if not in stacked mode (Stacked stays on Table)
      if (!isStacked) {
          if (result.status >= 400) setRightTab('LOGS');
          else setRightTab('BODY');
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 500) return 'text-lab-red border-lab-red bg-lab-red/10';
    if (status >= 400) return 'text-lab-orange border-lab-orange bg-lab-orange/10';
    if (status >= 200) return 'text-lab-green border-lab-green bg-lab-green/10';
    return 'text-lab-textMuted';
  };

  // Determine Syntax Language
  const requestLanguage = config.mode === 'GRAPHQL' ? 'graphql' : config.mode === 'SOAP' ? 'xml' : 'json';
  const responseLanguage = config.mode === 'SOAP' ? 'xml' : 'json'; // GraphQL returns JSON responses

  return (
    <div className="border border-lab-border rounded-lg bg-lab-panel overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-lab-border/80">
      
      {/* Cell Toolbar (Responsive) */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-lab-bgDim border-b border-lab-border">
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-lab-textMuted hover:text-lab-text">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            <select 
              value={config.method}
              onChange={(e) => setConfig({...config, method: e.target.value as any})}
              disabled={config.mode === 'GRAPHQL' || config.mode === 'SOAP'}
              className={`flex-shrink-0 bg-lab-bg border border-lab-border text-lab-blueAqua font-mono text-xs font-bold py-1.5 px-2 rounded focus:outline-none focus:border-lab-blue ${config.mode === 'GRAPHQL' || config.mode === 'SOAP' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {['GET','POST','PUT','DELETE','PATCH'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            
            <input 
                type="text" 
                value={config.endpoint}
                onChange={(e) => setConfig({...config, endpoint: e.target.value})}
                className="flex-1 min-w-[150px] bg-lab-bg border border-lab-border text-lab-text font-mono text-sm py-1.5 px-3 rounded focus:outline-none focus:border-lab-blue placeholder-lab-textMuted/50"
            />

            <button 
              onClick={handleSend}
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

      {/* Cell Content (Collapsible) */}
      {isExpanded && (
        <div className={`flex flex-col ${isStacked ? '' : 'lg:flex-row'} ${isStacked ? 'h-auto' : 'h-auto lg:h-[450px]'} divide-y ${isStacked ? 'divide-lab-border' : 'lg:divide-y-0 lg:divide-x divide-lab-border'}`}>
            
            {/* LEFT: Request Composer (HIDDEN IN STACKED MODE) */}
            {!isStacked && (
              <div className={`flex-col lg:flex-1 flex min-w-0 h-[400px] lg:h-auto bg-lab-bg/50`}>
                  <div className="flex items-center justify-between px-2 border-b border-lab-border bg-lab-bgDim/30 backdrop-blur-sm shrink-0 h-10 overflow-x-auto no-scrollbar">
                      <div className="flex h-full shrink-0">
                          <button 
                              onClick={() => setLeftTab('BODY')}
                              className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${leftTab === 'BODY' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}
                          >
                              BODY
                          </button>
                          <button 
                              onClick={() => setLeftTab('HEADERS')}
                              className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${leftTab === 'HEADERS' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}
                          >
                              HEADERS
                          </button>
                      </div>
                      
                      <div className="flex items-center shrink-0 ml-4">
                        {/* Form/Raw Toggle only for Body + REST */}
                        {leftTab === 'BODY' && config.mode === 'REST' && (
                            <div className="flex scale-90 bg-lab-bg rounded border border-lab-border group mr-2">
                                <button onClick={() => setInputMode('RAW')} className={`p-1 px-2 border-r border-lab-border ${inputMode === 'RAW' ? 'text-lab-text bg-lab-border/30' : 'text-lab-textMuted hover:text-lab-text'}`}><Code className="w-3 h-3"/></button>
                                <button onClick={() => setInputMode('FORM')} className={`p-1 px-2 ${inputMode === 'FORM' ? 'text-lab-text bg-lab-border/30' : 'text-lab-textMuted hover:text-lab-text'}`}><List className="w-3 h-3"/></button>
                            </div>
                        )}

                        {/* Mode Selector */}
                        {readOnly ? (
                            <div className="flex scale-90">
                                <span className={`px-2 py-1 text-[10px] font-bold rounded border border-lab-border ${
                                    config.mode === 'REST' ? 'text-lab-blue bg-lab-blue/10' :
                                    config.mode === 'GRAPHQL' ? 'text-lab-purple bg-lab-purple/10' :
                                    'text-lab-orange bg-lab-orange/10'
                                }`}>
                                    {config.mode === 'GRAPHQL' ? 'GQL' : config.mode}
                                </span>
                            </div>
                        ) : (
                            <div className="flex scale-90 bg-lab-bg rounded border border-lab-border">
                                <button onClick={() => handleModeSwitch('REST')} className={`px-2 py-1 text-[10px] font-bold border-r border-lab-border transition-colors ${config.mode === 'REST' ? 'text-lab-blue bg-lab-blue/10' : 'text-lab-textMuted'}`}>REST</button>
                                <button onClick={() => handleModeSwitch('GRAPHQL')} className={`px-2 py-1 text-[10px] font-bold border-r border-lab-border transition-colors ${config.mode === 'GRAPHQL' ? 'text-lab-purple bg-lab-purple/10' : 'text-lab-textMuted'}`}>GQL</button>
                                <button onClick={() => handleModeSwitch('SOAP')} className={`px-2 py-1 text-[10px] font-bold transition-colors ${config.mode === 'SOAP' ? 'text-lab-orange bg-lab-orange/10' : 'text-lab-textMuted'}`}>SOAP</button>
                            </div>
                        )}
                      </div>
                  </div>

                  <div className="flex-1 p-0 relative overflow-hidden">
                      {leftTab === 'BODY' ? (
                          inputMode === 'RAW' ? (
                              <div className="relative w-full h-full group">
                                  <JsonEditor 
                                    value={config.body} 
                                    onChange={handleBodyChange} 
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
                                          <input className="flex-1 bg-lab-bg border border-lab-border focus:border-lab-blueAqua text-lab-blueAqua text-xs p-1.5 rounded font-mono outline-none transition-colors" value={row.key} onChange={e => handleFormChange(row.id, 'key', e.target.value)} placeholder="Key" />
                                          <span className="text-lab-textMuted">:</span>
                                          <input className="flex-[2] bg-lab-bg border border-lab-border focus:border-lab-blueAqua text-lab-text text-xs p-1.5 rounded font-mono outline-none transition-colors" value={row.value} onChange={e => handleFormChange(row.id, 'value', e.target.value)} placeholder="Value" />
                                          <button onClick={() => removeFormRow(row.id)} className="text-lab-textMuted hover:text-lab-red opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3"/></button>
                                      </div>
                                  ))}
                                  <button onClick={addFormRow} className="w-full py-1 border border-dashed border-lab-border text-lab-textMuted hover:text-lab-green hover:border-lab-green text-xs font-mono mt-2 transition-all">+ ADD FIELD</button>
                              </div>
                          )
                      ) : (
                          // HEADERS TAB
                          <JsonEditor 
                            value={config.headers}
                            onChange={val => setConfig({...config, headers: val})}
                            placeholder='{ "Content-Type": "application/json" }'
                            language='json'
                          />
                      )}
                  </div>
              </div>
            )}

            {/* RIGHT: Response Analysis (Takes full width if stacked) */}
            <div className={`${isStacked ? 'w-full h-[600px]' : 'flex-col lg:flex-1 flex min-w-0 h-[500px] lg:h-auto'} bg-lab-bg/50 flex flex-col`}>
                {response ? (
                    <>
                        <div className="flex items-center justify-between px-2 border-b border-lab-border bg-lab-bgDim/30 backdrop-blur-sm shrink-0 h-10 overflow-x-auto no-scrollbar">
                            <div className="flex h-full shrink-0">
                                <button onClick={() => setRightTab('BODY')} className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${rightTab === 'BODY' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}>
                                    {responseLanguage === 'xml' ? 'XML' : 'JSON'}
                                </button>
                                <button onClick={() => setRightTab('TABLE')} className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${rightTab === 'TABLE' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}>TABLE</button>
                                <button onClick={() => setRightTab('LOGS')} className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${rightTab === 'LOGS' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}>LOGS</button>
                                <button onClick={() => setRightTab('HEADERS')} className={`px-4 text-xs font-mono font-bold border-b-2 transition-colors h-full flex items-center ${rightTab === 'HEADERS' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}>HEADERS</button>
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
                ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-lab-textMuted/40 gap-2">
                         <Cpu className="w-12 h-12 animate-pulse opacity-50" />
                         <span className="text-xs font-mono tracking-widest">READY_FOR_TRANSMISSION</span>
                     </div>
                )}
            </div>

        </div>
      )}
    </div>
  );
};