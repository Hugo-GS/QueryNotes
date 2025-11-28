import { useState } from 'react';

interface FormRow {
  id: string;
  key: string;
  value: string;
}

export const useFormBuilder = () => {
  const [formRows, setFormRows] = useState<FormRow[]>([]);

  const handleFormChange = (id: string, field: 'key' | 'value', newValue: string) => {
    const newRows = formRows.map(row =>
      row.id === id ? { ...row, [field]: newValue } : row
    );
    setFormRows(newRows);
    return formRowsToJson(newRows);
  };

  const addFormRow = () => {
    setFormRows([...formRows, { id: Math.random().toString(), key: '', value: '' }]);
  };

  const removeFormRow = (id: string) => {
    const newRows = formRows.filter(r => r.id !== id);
    setFormRows(newRows);
    return formRowsToJson(newRows);
  };

  const formRowsToJson = (rows: FormRow[]): string => {
    const obj = rows.reduce((acc, row) => {
      if (!row.key) return acc;
      return { ...acc, [row.key]: row.value };
    }, {});
    return JSON.stringify(obj, null, 2);
  };

  return {
    formRows,
    handleFormChange,
    addFormRow,
    removeFormRow
  };
};
