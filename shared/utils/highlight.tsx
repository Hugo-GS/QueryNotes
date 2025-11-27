
import React from 'react';

export const highlightJSON = (json: string): React.ReactNode => {
  if (!json) return null;

  // Regex Tokenizer for JSON
  const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)|(\b(true|false|null)\b)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = regex.exec(json)) !== null) {
    const [fullMatch, stringGroup, , colonGroup, boolNullGroup, , numberGroup] = match;
    const index = match.index;

    if (index > lastIndex) {
      elements.push(
        <span key={`txt-${keyIndex++}`} className="text-lab-textMuted">
          {json.substring(lastIndex, index)}
        </span>
      );
    }

    let className = 'text-lab-text';
    
    if (stringGroup) {
      if (colonGroup || stringGroup.trim().endsWith(':')) {
         className = 'text-lab-red font-bold'; // Key
      } else {
         className = 'text-lab-green'; // String Value
      }
    } else if (boolNullGroup) {
      if (boolNullGroup === 'null') {
        className = 'text-lab-textMuted italic';
      } else {
        className = 'text-lab-orange font-bold';
      }
    } else if (numberGroup) {
      className = 'text-lab-purple';
    }

    elements.push(
      <span key={`token-${keyIndex++}`} className={className}>
        {fullMatch}
      </span>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < json.length) {
    elements.push(
      <span key={`end-${keyIndex++}`} className="text-lab-textMuted">
        {json.substring(lastIndex)}
      </span>
    );
  }

  return <>{elements}</>;
};

export const highlightXML = (xml: string): React.ReactNode => {
  if (!xml) return null;

  // Regex for XML/SOAP
  // 1. Comments: <!-- ... -->
  // 2. CData: <![CDATA[ ... ]]>
  // 3. Tags (Open/Close): </name, <name, >, />
  // 4. Attributes: name=
  // 5. Strings: "value"
  const regex = /(<!--[\s\S]*?-->)|(<!\[CDATA\[[\s\S]*?\]\]>)|(<\/?[\w:.-]+)|(\/?>)|([\w:.-]+=)|("[^"]*")/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = regex.exec(xml)) !== null) {
      const [fullMatch, comment, cdata, tagStart, tagEnd, attrKey, stringVal] = match;
      const index = match.index;

      if (index > lastIndex) {
          elements.push(<span key={`txt-${keyIndex++}`} className="text-lab-text">{xml.substring(lastIndex, index)}</span>);
      }

      let className = 'text-lab-text';
      if (comment) className = 'text-lab-textMuted italic';
      else if (cdata) className = 'text-lab-yellow'; // CDATA content
      else if (tagStart) className = 'text-lab-blue font-bold';
      else if (tagEnd) className = 'text-lab-blue font-bold';
      else if (attrKey) className = 'text-lab-red';
      else if (stringVal) className = 'text-lab-green';

      elements.push(<span key={`token-${keyIndex++}`} className={className}>{fullMatch}</span>);
      lastIndex = regex.lastIndex;
  }
  if (lastIndex < xml.length) {
      elements.push(<span key={`end-${keyIndex++}`} className="text-lab-text">{xml.substring(lastIndex)}</span>);
  }
  return <>{elements}</>;
};

export const highlightGQL = (gql: string): React.ReactNode => {
    if (!gql) return null;

    // Regex for GraphQL
    // 1. Comments: # ...
    // 2. Strings: "..."
    // 3. Variables: $var
    // 4. Keywords
    // 5. Punctuation/Operators
    const regex = /(#.*)|("[^"]*")|(\$[a-zA-Z_][\w]*)|(\b(?:query|mutation|subscription|fragment|type|input|enum|interface|union|scalar|directive|extend|on)\b)|([{}()!:.,])/g;
    
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = regex.exec(gql)) !== null) {
        const [fullMatch, comment, stringVal, variable, keyword, punctuation] = match;
        const index = match.index;
        
         if (index > lastIndex) {
          // Non-matched text (likely field names or whitespace)
          elements.push(<span key={`txt-${keyIndex++}`} className="text-lab-text">{gql.substring(lastIndex, index)}</span>);
        }

        let className = 'text-lab-text';
        if (comment) className = 'text-lab-textMuted italic';
        else if (stringVal) className = 'text-lab-green';
        else if (variable) className = 'text-lab-orange';
        else if (keyword) className = 'text-lab-purple font-bold';
        else if (punctuation) className = 'text-lab-textMuted';

        elements.push(<span key={`token-${keyIndex++}`} className={className}>{fullMatch}</span>);
        lastIndex = regex.lastIndex;
    }
     if (lastIndex < gql.length) {
      elements.push(<span key={`end-${keyIndex++}`} className="text-lab-text">{gql.substring(lastIndex)}</span>);
  }
  return <>{elements}</>;
};
