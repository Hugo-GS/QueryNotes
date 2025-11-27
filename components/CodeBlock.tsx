import React from 'react';

interface CodeBlockProps {
  code: any;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const formatted = typeof code === 'string' ? code : JSON.stringify(code, null, 2);

  return (
    <pre className="font-mono text-sm overflow-y-auto overflow-x-hidden p-4 h-full w-full text-lab-text bg-lab-codeBg border border-lab-border rounded-md whitespace-pre-wrap break-words transition-colors duration-300">
      <code>{formatted}</code>
    </pre>
  );
};