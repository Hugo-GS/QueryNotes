
import React, { useState } from 'react';
import { Edit3, Check, Trash2, FileText } from 'lucide-react';

interface TextCellProps {
  content: string;
  onUpdate: (newContent: string) => void;
  onDelete: () => void;
}

export const TextCell: React.FC<TextCellProps> = ({ content, onUpdate, onDelete }) => {
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

      {isEditing ? (
        <div className="bg-lab-bgDim border border-lab-blueAqua/30 rounded-md p-2 animate-in fade-in">
          <textarea
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            className="w-full bg-transparent text-lab-text font-mono text-sm p-2 focus:outline-none min-h-[100px] resize-y"
            placeholder="Enter your lab notes here..."
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
            className="prose prose-invert max-w-none text-lab-textMuted font-sans text-sm whitespace-pre-wrap leading-relaxed p-2 hover:text-lab-text transition-colors cursor-text"
            onClick={() => setIsEditing(true)}
          >
            {content || <span className="italic opacity-50">Click to add notes...</span>}
          </div>
          
          <div className="absolute top-0 right-0 opacity-0 group-hover/content:opacity-100 transition-opacity flex gap-2">
             <button 
              onClick={() => setIsEditing(true)}
              className="p-1 text-lab-textMuted hover:text-lab-blueAqua transition-colors"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button 
              onClick={onDelete}
              className="p-1 text-lab-textMuted hover:text-lab-red transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
