
import React, { useRef } from 'react';
import { highlightJSON, highlightXML, highlightGQL } from '../utils/highlight';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  language?: 'json' | 'xml' | 'graphql';
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  hasError,
  language = 'json'
}) => {
  const preRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const getHighlightedContent = () => {
    switch (language) {
      case 'xml':
        return highlightXML(value);
      case 'graphql':
        return highlightGQL(value);
      case 'json':
      default:
        return highlightJSON(value);
    }
  };

  // Styles shared exactly between textarea and pre to ensure perfect alignment
  const sharedStyles = "absolute inset-0 w-full h-full font-mono text-xs p-4 leading-relaxed whitespace-pre-wrap break-words border-none outline-none resize-none overflow-auto custom-scrollbar";

  return (
    <div className={`relative w-full h-full bg-lab-codeBg ${className} ${hasError ? 'bg-lab-red/5 border border-lab-red/50' : ''}`}>
      {/* Highlight Layer (Visual only) */}
      <pre 
        ref={preRef}
        className={`${sharedStyles} z-0 pointer-events-none text-lab-text`}
        aria-hidden="true"
      >
        {getHighlightedContent()}
        {/* Add a break at the end to prevent visual jump when typing at very bottom */}
        <br /> 
      </pre>
      
      {/* Input Layer (Interaction) */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
        className={`${sharedStyles} z-10 bg-transparent text-transparent caret-lab-text placeholder-lab-textMuted/50`}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  );
};
