
import React, { useState } from 'react';
import { Globe, X, Check, AlertCircle } from 'lucide-react';

interface LoadUrlModalProps {
  onLoad: (url: string) => void;
  onClose: () => void;
}

export const LoadUrlModal: React.FC<LoadUrlModalProps> = ({ onLoad, onClose }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    try {
      new URL(url); // Validate URL format
      onLoad(url);
      onClose();
    } catch (e) {
      setError('Invalid URL format');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-lab-panel border border-lab-border shadow-2xl rounded-lg overflow-hidden ring-1 ring-lab-border/50">
        
        <div className="flex items-center justify-between px-4 py-3 bg-lab-bgDim border-b border-lab-border">
          <div className="flex items-center gap-2 text-lab-text font-bold font-mono">
            <Globe className="w-4 h-4 text-lab-blueAqua" />
            <span>LOAD FROM URL</span>
          </div>
          <button onClick={onClose} className="text-lab-textMuted hover:text-lab-red transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-lab-textMuted uppercase">Notebook JSON URL</label>
            <div className="relative">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(''); }}
                  placeholder="https://example.com/my-notebook.json"
                  className={`w-full bg-lab-bg border ${error ? 'border-lab-red' : 'border-lab-border'} text-lab-text px-3 py-2 rounded font-mono text-sm focus:outline-none focus:border-lab-blueAqua`}
                  autoFocus
                />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-lab-red text-xs font-mono animate-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </div>
            )}
            <p className="text-xs text-lab-textMuted leading-relaxed">
              Enter a direct link to a raw JSON file containing a valid notebook configuration.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono font-bold text-lab-textMuted hover:text-lab-text border border-transparent hover:border-lab-border rounded transition-colors"
            >
              CANCEL
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold bg-lab-blueAqua text-lab-bgDim hover:bg-lab-blue hover:text-white rounded transition-colors shadow-lg shadow-lab-blueAqua/20"
            >
              <Check className="w-3 h-3" />
              LOAD NOTEBOOK
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
