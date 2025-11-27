
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { highlightJSON, highlightXML, highlightGQL } from '../utils/highlight';

interface CodeBlockProps {
  code: any;
  language?: 'json' | 'xml' | 'graphql';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'json' }) => {
  const [copied, setCopied] = useState(false);
  
  // Formatting logic
  let formatted = "";
  let effectiveLanguage = language;

  if (typeof code === 'string') {
    try {
        // Try to parse as JSON first if language is JSON (default)
        const parsed = JSON.parse(code);
        formatted = JSON.stringify(parsed, null, 2);
        effectiveLanguage = 'json';
    } catch (e) {
        // Not JSON (likely XML, plain text, or invalid JSON)
        formatted = code;
    }
  } else {
    // It is an object, imply JSON
    formatted = JSON.stringify(code, null, 2);
    effectiveLanguage = 'json';
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
      switch (effectiveLanguage) {
          case 'xml': return highlightXML(formatted);
          case 'graphql': return highlightGQL(formatted);
          case 'json': return highlightJSON(formatted);
          default: return formatted;
      }
  };

  return (
    <div className="relative group h-full w-full bg-lab-codeBg border border-lab-border rounded-md overflow-hidden flex flex-col">
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={handleCopy}
                className="p-1.5 bg-lab-bgDim border border-lab-border rounded text-lab-textMuted hover:text-lab-blueAqua transition-colors shadow-sm"
            >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
            <pre className="font-mono text-sm p-4 text-lab-text whitespace-pre-wrap break-words leading-relaxed w-full">
                <code>{renderContent()}</code>
            </pre>
        </div>
    </div>
  );
};
