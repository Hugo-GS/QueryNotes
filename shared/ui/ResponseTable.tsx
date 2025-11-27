
import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';

interface ResponseTableProps {
  data: any;
}

type SortDirection = 'asc' | 'desc' | null;

export const ResponseTable: React.FC<ResponseTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({
    key: '',
    direction: null,
  });

  // 1. Normalize Data: Try to find an array to display, or convert object to single row
  const tableData = useMemo(() => {
    if (!data) return null;

    // Case A: Direct Array
    if (Array.isArray(data)) {
      return data;
    }

    // Case B: Object with nested array
    if (typeof data === 'object') {
      // Look for common array property names or the first array found with items
      const keys = Object.keys(data);
      const candidateKey = keys.find(k => Array.isArray(data[k]) && data[k].length > 0);
      if (candidateKey) return data[candidateKey];

      // Case C: Single Object (Treat as 1 row)
      // Filter out complex objects/arrays from the top level to keep the table clean, 
      // or just show primitive values.
      if (keys.length > 0) {
         return [data];
      }
    }

    return null;
  }, [data]);

  // 2. Extract Columns
  const columns = useMemo(() => {
    if (!tableData || tableData.length === 0) return [];
    // Union of all keys in the array objects
    const keys = new Set<string>();
    tableData.forEach((item: any) => {
      if (item && typeof item === 'object') {
        Object.keys(item).forEach(k => keys.add(k));
      }
    });
    return Array.from(keys);
  }, [tableData]);

  // 3. Handle Sorting
  const sortedData = useMemo(() => {
    if (!tableData) return [];
    if (!sortConfig.key || !sortConfig.direction) return tableData;

    const sorted = [...tableData].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA === valB) return 0;
      
      // Handle null/undefined
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      // Compare based on type
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      }
      
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      
      if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
      
      return 0;
    });
    return sorted;
  }, [tableData, sortConfig]);

  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  // Render Logic
  if (!tableData || tableData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-lab-textMuted p-8 text-center">
        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm font-mono">Response data is not tabular.</p>
        <p className="text-xs opacity-60 mt-1">Try viewing as JSON.</p>
      </div>
    );
  }

  const renderCell = (value: any) => {
    if (value === null || value === undefined) return <span className="text-lab-textMuted italic">null</span>;
    
    if (typeof value === 'object') {
        const str = JSON.stringify(value);
        // Create a preview string (e.g., {"id": 1, ...})
        const preview = str.length > 30 ? str.substring(0, 30) + '...' : str;
        return (
            <span 
                title={JSON.stringify(value, null, 2)} 
                className="text-lab-textMuted text-xs font-mono cursor-help hover:text-lab-blueAqua hover:underline transition-colors"
            >
                {preview}
            </span>
        );
    }

    if (typeof value === 'boolean') return <span className={value ? 'text-lab-green' : 'text-lab-red'}>{String(value)}</span>;
    
    return String(value);
  };

  return (
    <div className="w-full h-full bg-lab-codeBg overflow-auto custom-scrollbar border border-lab-border rounded-md flex flex-col">
      <table className="w-full border-collapse text-sm font-mono text-left">
        <thead className="sticky top-0 bg-lab-bgDim z-10 shadow-sm ring-1 ring-lab-border/50">
          <tr>
            <th className="p-2 border-b border-r border-lab-border text-lab-textMuted w-10 text-center font-normal bg-lab-bgDim">#</th>
            {columns.map(col => (
              <th 
                key={col} 
                className="p-2 border-b border-r border-lab-border min-w-[120px] cursor-pointer hover:bg-lab-border/20 transition-colors group select-none bg-lab-bgDim"
                onClick={() => handleSort(col)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lab-blueAqua font-bold truncate">{col}</span>
                  <div className="flex flex-col opacity-30 group-hover:opacity-100">
                    <ChevronUp className={`w-3 h-3 ${sortConfig.key === col && sortConfig.direction === 'asc' ? 'text-lab-blueAqua opacity-100' : ''}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortConfig.key === col && sortConfig.direction === 'desc' ? 'text-lab-blueAqua opacity-100' : ''}`} />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-lab-border/30 bg-lab-codeBg">
          {sortedData.map((row: any, rowIndex: number) => (
            <tr key={rowIndex} className="hover:bg-lab-border/10 transition-colors">
              <td className="p-2 border-r border-lab-border text-lab-textMuted text-center text-xs">{rowIndex + 1}</td>
              {columns.map(col => (
                <td key={`${rowIndex}-${col}`} className="p-2 border-r border-lab-border text-lab-text whitespace-nowrap max-w-[300px] overflow-hidden text-ellipsis">
                  {renderCell(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
