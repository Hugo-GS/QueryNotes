
import React, { useState } from 'react';
import { 
  Play, Clock, Terminal, Code, Lock, RotateCcw, 
  Box, Cpu, List, Plus, Trash2, ChevronDown, ChevronRight, X 
} from 'lucide-react';
import { RequestConfig, SimulatedResponse } from '../types';
import { simulateBackendRequest } from '../services/geminiService';
import { CodeBlock } from './CodeBlock';
import { TerminalLogs } from './TerminalLogs';

interface RequestCellProps {
  id: string;
  initialConfig: RequestConfig;
  onDelete: () => void;
}

export const RequestCell: React.FC<RequestCellProps> = ({ id, initialConfig, onDelete }) => {
  // -- State --
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<RequestConfig>(initialConfig);
  const [response, setResponse] = useState<SimulatedResponse | null>(null);
  
  // UI State
  const [leftTab, setLeftTab] = useState<'BODY' | 'HEADERS'>('BODY');
  const [rightTab, setRightTab] = useState<'BODY' | 'HEADERS' | 'LOGS'>('BODY');
  const [inputMode, setInputMode] = useState<'RAW' | 'FORM'>('RAW'); // For Body only
  const [formRows, setFormRows] = useState<{id: string, key: string, value: string}[]>([]);

  // -- Handlers --

  const handleModeSwitch = (mode: 'REST' | 'GRAPHQL') => {
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
}`
        }));
        setInputMode('RAW');
    } else {
        setConfig(prev => ({
            ...prev,
            mode: 'REST',
            method: 'GET',
            endpoint: '/api/v1/resource'
        }));
    }
  };

  // Form Sync Logic (Simplified for Cell)
  const handleFormChange = (id: string, field: 'key' | 'value', newValue: string) => {
    const newRows = formRows.map(row => row.id === id ? { ...row, [field]: newValue } : row);
    setFormRows(newRows);
    
    const obj = newRows.reduce((acc, row) => {
       if (!row.key) return acc;
       return { ...acc, [row.key]: row.value };
    }, {});
    setConfig(prev => ({...prev, body: JSON.stringify(obj, null, 2)}));
  };

  const addFormRow = () => setFormRows([...formRows, { id: Math.random().toString(), key: '', value: '' }]);
  const removeFormRow = (id: string) => {
      const newRows = formRows.filter(r => r.id !== id);
      setFormRows(newRows);
      // Update body logic omitted for brevity, syncs on next type usually or add effect
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
      const result = await simulateBackendRequest(config.mode, config.method, config.endpoint, config.body);
      setResponse(result);
      
      if (result.status >= 400) setRightTab('LOGS');
      else setRightTab('BODY');

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

  return (
    <div className="border border-lab-border rounded-lg bg-lab-panel overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-lab-border/80">
      
      {/* Cell Toolbar */}
      <div className="flex items-center gap-3 p-3 bg-lab-bgDim border-b border-lab-border">
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-lab-textMuted hover:text-lab-text">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        <div className="flex items-center gap-2 flex-1">
            <select 
              value={config.method}
              onChange={(e) => setConfig({...config, method: e.target.value as any})}
              disabled={config.mode === 'GRAPHQL'}
              className={`bg-lab-bg border border-lab-border text-lab-blueAqua font-mono text-xs font-bold py-1.5 px-2 rounded focus:outline-none focus:border-lab-blue ${config.mode === 'GRAPHQL' ? 'opacity-50' : ''}`}
            >
              {['GET','POST','PUT','DELETE','PATCH'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            
            <input 
                type="text" 
                value={config.endpoint}
                onChange={(e) => setConfig({...config, endpoint: e.target.value})}
                className="flex-1 bg-lab-bg border border-lab-border text-lab-text font-mono text-sm py-1.5 px-3 rounded focus:outline-none focus:border-lab-blue placeholder-lab-textMuted/50"
            />

            <button 
              onClick={handleSend}
              disabled={loading}
              className="flex items-center gap-2 bg-lab-selection text-lab-blueAqua hover:bg-lab-blue hover:text-lab-bgDim px-4 py-1.5 rounded font-mono text-xs font-bold transition-colors disabled:opacity-50"
            >
               {loading ? <Clock className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
               SEND
            </button>
        </div>

        <button onClick={onDelete} className="text-lab-textMuted hover:text-lab-red p-1">
            <X className="w-4 h-4" />
        </button>
      </div>

      {/* Cell Content (Collapsible) */}
      {isExpanded && (
        <div className="flex flex-col lg:flex-row h-[450px] divide-y lg:divide-y-0 lg:divide-x divide-lab-border">
            
            {/* LEFT: Request Composer */}
            <div className="flex-1 flex flex-col min-w-0 bg-lab-bg/50">
                <div className="flex items-center justify-between px-2 border-b border-lab-border bg-lab-bgDim/30">
                    <div className="flex">
                        <button 
                            onClick={() => setLeftTab('BODY')}
                            className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-colors ${leftTab === 'BODY' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}
                        >
                            BODY
                        </button>
                        <button 
                            onClick={() => setLeftTab('HEADERS')}
                            className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-colors ${leftTab === 'HEADERS' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}
                        >
                            HEADERS
                        </button>
                    </div>
                    
                    {/* Form/Raw Toggle only for Body + REST */}
                    {leftTab === 'BODY' && config.mode === 'REST' && (
                         <div className="flex scale-90 bg-lab-bg rounded border border-lab-border">
                            <button onClick={() => setInputMode('RAW')} className={`p-1 px-2 ${inputMode === 'RAW' ? 'text-lab-text bg-lab-border/50' : 'text-lab-textMuted'}`}><Code className="w-3 h-3"/></button>
                            <button onClick={() => setInputMode('FORM')} className={`p-1 px-2 ${inputMode === 'FORM' ? 'text-lab-text bg-lab-border/50' : 'text-lab-textMuted'}`}><List className="w-3 h-3"/></button>
                         </div>
                    )}
                     <div className="flex scale-90 bg-lab-bg rounded border border-lab-border ml-2">
                        <button onClick={() => handleModeSwitch('REST')} className={`px-2 py-1 text-[10px] font-bold ${config.mode === 'REST' ? 'text-lab-blue' : 'text-lab-textMuted'}`}>REST</button>
                        <div className="w-[1px] bg-lab-border"></div>
                        <button onClick={() => handleModeSwitch('GRAPHQL')} className={`px-2 py-1 text-[10px] font-bold ${config.mode === 'GRAPHQL' ? 'text-lab-purple' : 'text-lab-textMuted'}`}>GQL</button>
                     </div>
                </div>

                <div className="flex-1 p-0 relative overflow-hidden">
                    {leftTab === 'BODY' ? (
                        inputMode === 'RAW' ? (
                            <textarea 
                                value={config.body}
                                onChange={e => setConfig({...config, body: e.target.value})}
                                className="w-full h-full bg-lab-codeBg text-lab-text font-mono text-xs p-4 focus:outline-none resize-none"
                                spellCheck={false}
                            />
                        ) : (
                            <div className="p-4 space-y-2 overflow-y-auto h-full bg-lab-codeBg">
                                {formRows.map((row) => (
                                    <div key={row.id} className="flex gap-2 items-center">
                                        <input className="flex-1 bg-lab-bg border border-lab-border text-lab-blueAqua text-xs p-1.5 rounded font-mono" value={row.key} onChange={e => handleFormChange(row.id, 'key', e.target.value)} placeholder="Key" />
                                        <span className="text-lab-textMuted">:</span>
                                        <input className="flex-[2] bg-lab-bg border border-lab-border text-lab-text text-xs p-1.5 rounded font-mono" value={row.value} onChange={e => handleFormChange(row.id, 'value', e.target.value)} placeholder="Value" />
                                        <button onClick={() => removeFormRow(row.id)} className="text-lab-textMuted hover:text-lab-red"><Trash2 className="w-3 h-3"/></button>
                                    </div>
                                ))}
                                <button onClick={addFormRow} className="w-full py-1 border border-dashed border-lab-border text-lab-textMuted hover:text-lab-green text-xs font-mono mt-2">+ ADD FIELD</button>
                            </div>
                        )
                    ) : (
                        // HEADERS TAB
                        <textarea 
                            value={config.headers}
                            onChange={e => setConfig({...config, headers: e.target.value})}
                            className="w-full h-full bg-lab-codeBg text-lab-text font-mono text-xs p-4 focus:outline-none resize-none"
                            placeholder='{ "Content-Type": "application/json" }'
                            spellCheck={false}
                        />
                    )}
                </div>
            </div>

            {/* RIGHT: Response Analysis */}
            <div className="flex-1 flex flex-col min-w-0 bg-lab-bg/50">
                {response ? (
                    <>
                        <div className="flex items-center justify-between px-2 border-b border-lab-border bg-lab-bgDim/30">
                            <div className="flex">
                                <button onClick={() => setRightTab('BODY')} className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-colors ${rightTab === 'BODY' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}>JSON</button>
                                <button onClick={() => setRightTab('LOGS')} className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-colors ${rightTab === 'LOGS' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}>LOGS</button>
                                <button onClick={() => setRightTab('HEADERS')} className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-colors ${rightTab === 'HEADERS' ? 'border-lab-blueAqua text-lab-blueAqua' : 'border-transparent text-lab-textMuted hover:text-lab-text'}`}>HEADERS</button>
                            </div>
                            <div className={`text-xs font-mono px-2 py-0.5 rounded border ${getStatusColor(response.status)}`}>
                                {response.status} {response.statusText} ({response.latency}ms)
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden bg-lab-bg relative">
                             {rightTab === 'BODY' && <CodeBlock code={response.body} />}
                             {rightTab === 'LOGS' && <TerminalLogs logs={response.logs} sql={response.sql} />}
                             {rightTab === 'HEADERS' && <CodeBlock code={response.headers} />}
                        </div>
                    </>
                ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-lab-textMuted/40 gap-2">
                         <Cpu className="w-12 h-12 animate-pulse" />
                         <span className="text-xs font-mono">READY_FOR_TRANSMISSION</span>
                     </div>
                )}
            </div>

        </div>
      )}
    </div>
  );
};
