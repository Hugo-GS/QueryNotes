
import React, { useState } from 'react';
import { Edit3, Check, Trash2, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TextCellProps {
  content: string;
  onUpdate: (newContent: string) => void;
  onDelete: () => void;
  readOnly?: boolean;
}

export const TextCell: React.FC<TextCellProps> = ({ content, onUpdate, onDelete, readOnly }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(content);

  const handleSave = () => {
    onUpdate(tempContent);
    setIsEditing(false);
  };

  return (
    <div className="group relative pl-4 border-l-2 border-dashed border-lab-border hover:border-lab-textMuted transition-colors py-2">
      <div className="absolute -left-3 top-0 bg-lab-bg p-1 rounded-full border border-lab-border text-lab-textMuted">
        <FileText className="w-3 h-3" />
      </div>

      {isEditing && !readOnly ? (
        <div className="bg-lab-bgDim border border-lab-blueAqua/30 rounded-md p-2 animate-in fade-in">
          <textarea
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            className="w-full bg-transparent text-lab-text font-mono text-sm p-2 focus:outline-none min-h-[100px] resize-y"
            placeholder="Enter your lab notes here (Markdown supported)..."
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button 
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-lab-blueAqua/10 text-lab-blueAqua hover:bg-lab-blueAqua/20 rounded text-xs font-mono"
            >
              <Check className="w-3 h-3" /> DONE
            </button>
          </div>
        </div>
      ) : (
        <div className="group/content relative">
          <div 
            className={`prose-custom max-w-none font-sans text-sm whitespace-pre-wrap transition-colors ${!readOnly ? 'cursor-text' : ''}`}
            onClick={() => !readOnly && setIsEditing(true)}
          >
             <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold text-lab-blueAqua border-b border-lab-border/50 pb-1 mb-3 mt-4 font-mono" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-bold text-lab-purple mt-5 mb-2 font-mono" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-base font-bold text-lab-yellow mt-4 mb-1 font-mono" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 leading-relaxed text-lab-textMuted/90" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 mb-3 space-y-1 text-lab-textMuted" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 mb-3 space-y-1 text-lab-textMuted" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    code: ({node, inline, className, children, ...props}: any) => {
                         return inline ? (
                            <code className="bg-lab-bgDim px-1.5 py-0.5 rounded text-lab-orange font-mono text-xs border border-lab-border/50" {...props}>{children}</code>
                         ) : (
                            <code className="block bg-lab-codeBg p-3 rounded border border-lab-border text-lab-text font-mono text-xs overflow-x-auto my-3" {...props}>{children}</code>
                         );
                    },
                    pre: ({node, ...props}) => <pre className="bg-transparent p-0 m-0" {...props} />,
                    a: ({node, ...props}) => <a className="text-lab-blue hover:underline decoration-dashed underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-lab-selection pl-4 my-4 italic text-lab-textMuted/70" {...props} />,
                    table: ({node, ...props}) => <div className="overflow-x-auto my-4 border border-lab-border rounded"><table className="min-w-full divide-y divide-lab-border" {...props} /></div>,
                    th: ({node, ...props}) => <th className="bg-lab-bgDim px-3 py-2 text-left text-xs font-medium text-lab-blueAqua uppercase tracking-wider" {...props} />,
                    td: ({node, ...props}) => <td className="px-3 py-2 whitespace-nowrap text-sm text-lab-textMuted border-t border-lab-border/30" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-lab-text font-bold" {...props} />,
                    em: ({node, ...props}) => <em className="text-lab-text/80 italic" {...props} />,
                }}
             >
                {content || "*Click to add notes...*"}
             </ReactMarkdown>
          </div>
          
          {!readOnly && (
            <div className="absolute top-0 right-0 opacity-0 group-hover/content:opacity-100 transition-opacity flex gap-2 bg-lab-bg/80 backdrop-blur rounded p-1">
                <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="p-1 text-lab-textMuted hover:text-lab-blueAqua transition-colors"
                title="Edit Markdown"
                >
                <Edit3 className="w-3 h-3" />
                </button>
                <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-1 text-lab-textMuted hover:text-lab-red transition-colors"
                title="Delete Cell"
                >
                <Trash2 className="w-3 h-3" />
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
