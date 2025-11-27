
import React, { useState, useEffect, useRef } from 'react';
import { Plus, LayoutTemplate, Trash2, Columns, Download, Upload, Globe, Loader2 } from 'lucide-react';

// Components
import { RequestCell } from '../request/RequestCell';
import { TextCell } from './TextCell';
import { RowCell } from './RowCell';
import { ContextMenu } from '../../shared/ui/ContextMenu';
import { LoadUrlModal } from './LoadUrlModal';

// Hooks
import { useNotebookState } from './hooks/useNotebookState';
import { useNotebookIO } from './hooks/useNotebookIO';
import { useResizable } from './hooks/useResizable';
import { useCellContextMenu } from './hooks/useCellContextMenu';

interface NotebookProps {
  isPresentationMode?: boolean;
  initialUrl?: string | null;
  initialWidth?: string | null;
  forceCollapse?: boolean;
}

export const Notebook: React.FC<NotebookProps> = ({
    isPresentationMode = false,
    initialUrl,
    initialWidth,
    forceCollapse = false
}) => {
  // 1. State Management
  const {
    cells, setCells,
    environmentUrl, setEnvironmentUrl,
    addRequestCell, addTextCell, addRowCell,
    deleteCell, updateTextCell, updateRequestConfig,
    updateCellResponse, updateCellLayout
  } = useNotebookState();

  // 2. IO Logic
  const {
    isLoading, fileInputRef,
    handleDownload, handleFileSelect, loadFromUrl
  } = useNotebookIO({ setCells, environmentUrl, setEnvironmentUrl, forceCollapse });

  const [loadUrlModalOpen, setLoadUrlModalOpen] = useState(false);

  // 3. UI Logic (Resizing & Context Menu)
  const { containerWidth, isResizing, startResize } = useResizable(initialWidth);
  const { contextMenu, handleContextMenu, closeContextMenu } = useCellContextMenu();

  // 4. Effects
  const hasLoadedInitialUrl = useRef(false);

  useEffect(() => {
    if (initialUrl && !hasLoadedInitialUrl.current) {
      loadFromUrl(initialUrl);
      hasLoadedInitialUrl.current = true;
    }
  }, [initialUrl, loadFromUrl]);

  return (
    <div 
        className="relative mx-auto min-h-screen bg-lab-bg border-lab-border shadow-2xl transition-[width] duration-75 ease-out max-w-full"
        style={{ 
            width: typeof containerWidth === 'string' ? containerWidth : `${containerWidth}px`,
            borderLeftWidth: '1px',
            borderRightWidth: '1px'
        }}
    >
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".json" 
          onChange={handleFileSelect}
        />

        {/* -- Resize Handles (Hidden on Mobile) -- */}
        <div 
            className={`hidden md:flex absolute top-0 bottom-0 -left-[6px] w-[12px] z-50 cursor-ew-resize items-center justify-center group transition-colors ${isResizing === 'left' ? 'bg-lab-blueAqua/50' : 'hover:bg-lab-blueAqua/20'}`}
            onMouseDown={(e) => startResize('left', e)}
        >
            <div className={`w-[1px] h-full bg-lab-border group-hover:bg-lab-blueAqua/50 transition-colors ${isResizing === 'left' ? 'bg-lab-blueAqua' : ''}`} />
        </div>
        <div 
            className={`hidden md:flex absolute top-0 bottom-0 -right-[6px] w-[12px] z-50 cursor-ew-resize items-center justify-center group transition-colors ${isResizing === 'right' ? 'bg-lab-blueAqua/50' : 'hover:bg-lab-blueAqua/20'}`}
            onMouseDown={(e) => startResize('right', e)}
        >
            <div className={`w-[1px] h-full bg-lab-border group-hover:bg-lab-blueAqua/50 transition-colors ${isResizing === 'right' ? 'bg-lab-blueAqua' : ''}`} />
        </div>


        <div className="p-2 md:p-8 flex flex-col gap-8 pb-32">
            {/* Header Actions (HIDDEN IN PRESENTATION MODE) */}
            {!isPresentationMode && (
                <div className="flex flex-col border-b border-lab-border pb-4 mb-4 gap-3">
                    {/* Environment URL Input */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono font-bold text-lab-textMuted uppercase">
                        Environment Base URL
                      </label>
                      <input
                        type="text"
                        value={environmentUrl}
                        onChange={(e) => setEnvironmentUrl(e.target.value)}
                        placeholder="https://api.example.com"
                        className="w-full px-3 py-2 text-sm font-mono bg-lab-bgDim border border-lab-border rounded text-lab-text placeholder:text-lab-textMuted/50 focus:outline-none focus:border-lab-blueAqua transition-colors"
                      />
                      <p className="text-xs font-mono text-lab-textMuted/70">
                        Optional base URL that will be automatically prefixed to all relative endpoints
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                      {isLoading && (
                      <div className="flex items-center gap-2 text-lab-textMuted mr-auto animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs font-mono">LOADING NOTEBOOK...</span>
                      </div>
                      )}

                      <div className="flex items-center justify-end gap-3 flex-wrap">
                      <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold text-lab-textMuted hover:text-lab-blueAqua border border-transparent hover:border-lab-border rounded transition-colors"
                          title="Import Notebook JSON File"
                      >
                          <Upload className="w-3 h-3" />
                          IMPORT FILE
                      </button>
                      
                      <button 
                          onClick={() => setLoadUrlModalOpen(true)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold text-lab-textMuted hover:text-lab-blueAqua border border-transparent hover:border-lab-border rounded transition-colors"
                          title="Load Notebook from URL"
                      >
                          <Globe className="w-3 h-3" />
                          LOAD URL
                      </button>

                        <button
                            onClick={() => handleDownload(cells)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold text-lab-blueAqua bg-lab-blueAqua/10 border border-lab-blueAqua/30 rounded hover:bg-lab-blueAqua/20 transition-colors"
                            title="Download Notebook JSON"
                        >
                            <Download className="w-3 h-3" />
                            EXPORT NOTEBOOK
                        </button>
                      </div>
                    </div>
                </div>
            )}

            {cells.map((cell, index) => (
            <div 
              key={cell.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500" 
              style={{ animationDelay: `${index * 100}ms` }}
              onContextMenu={(e) => handleContextMenu(e, cell.id, isPresentationMode)}
            >
                {cell.type === 'TEXT' ? (
                    <TextCell 
                    content={cell.content || ''} 
                    onUpdate={(val) => updateTextCell(cell.id, val)}
                    onDelete={() => deleteCell(cell.id)}
                    readOnly={isPresentationMode}
                    />
                ) : cell.type === 'ROW' ? (
                    <RowCell
                        id={cell.id}
                        textContent={cell.content || ''}
                        requestConfig={cell.requestConfig!}
                        initialResponse={cell.response}
                        onTextUpdate={(val) => updateTextCell(cell.id, val)}
                        onConfigUpdate={(cfg) => updateRequestConfig(cell.id, cfg)}
                        onResponseUpdate={(res) => updateCellResponse(cell.id, res)}
                        onDelete={() => deleteCell(cell.id)}
                        readOnly={isPresentationMode}
                        layout={cell.layout}
                        environmentUrl={environmentUrl}
                    />
                ) : (
                    <RequestCell
                    id={cell.id}
                    initialConfig={cell.requestConfig!}
                    initialResponse={cell.response}
                    onDelete={() => deleteCell(cell.id)}
                    onConfigChange={(cfg) => updateRequestConfig(cell.id, cfg)}
                    onResponseChange={(res) => updateCellResponse(cell.id, res)}
                    readOnly={isPresentationMode}
                    layout={cell.layout}
                    environmentUrl={environmentUrl}
                    />
                )}
            </div>
            ))}

            {/* Add Cell Buttons */}
            {!isPresentationMode && (
                <div className="flex flex-wrap items-center justify-center gap-4 py-8 opacity-50 hover:opacity-100 transition-opacity border-t border-dashed border-lab-border mt-4">
                <button onClick={addTextCell} className="flex items-center gap-2 px-4 py-2 bg-lab-bgDim border border-lab-border rounded-full hover:border-lab-textMuted text-lab-textMuted text-sm font-mono transition-colors">
                    <Plus className="w-4 h-4" /> ADD TEXT
                </button>
                <button onClick={addRequestCell} className="flex items-center gap-2 px-4 py-2 bg-lab-bgDim border border-lab-border rounded-full hover:border-lab-blueAqua hover:text-lab-blueAqua text-lab-textMuted text-sm font-mono transition-colors">
                    <Plus className="w-4 h-4" /> ADD REQUEST
                </button>
                <button onClick={addRowCell} className="flex items-center gap-2 px-4 py-2 bg-lab-bgDim border border-lab-border rounded-full hover:border-lab-purple hover:text-lab-purple text-lab-textMuted text-sm font-mono transition-colors">
                    <Columns className="w-4 h-4" /> ADD SPLIT ROW
                </button>
                </div>
            )}
        </div>

        {/* -- Context Menu & Modals -- */}
        
        {contextMenu.visible && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={closeContextMenu}
            items={[
              {
                label: 'View: Stacked (Table Focus)',
                icon: <LayoutTemplate className="rotate-180" />,
                onClick: () => contextMenu.cellId && updateCellLayout(contextMenu.cellId, 'STACKED')
              },
              {
                label: 'View: Split (Default)',
                icon: <Columns />,
                onClick: () => contextMenu.cellId && updateCellLayout(contextMenu.cellId, 'SPLIT')
              },
              {
                label: 'Delete Cell',
                icon: <Trash2 />,
                danger: true,
                onClick: () => contextMenu.cellId && deleteCell(contextMenu.cellId)
              }
            ]}
          />
        )}

        {loadUrlModalOpen && (
          <LoadUrlModal 
            onLoad={loadFromUrl} 
            onClose={() => setLoadUrlModalOpen(false)} 
          />
        )}
    </div>
  );
};