
import { useState, useCallback } from 'react';
import { NotebookCell } from '../types';
import { RequestConfig } from '../../request/types';
import { SimulatedResponse } from '../../../shared/types';

const INITIAL_CELLS: NotebookCell[] = [
  {
    id: 'intro-text',
    type: 'TEXT',
    content: "### Authentication Module Test\nFirst, we need to establish a session token for the user `admin_01`."
  },
  {
    id: 'req-login',
    type: 'REQUEST',
    isExpanded: true,
    requestConfig: {
      mode: 'REST',
      method: 'POST',
      endpoint: '/api/auth/login',
      body: JSON.stringify({ username: "admin_01", password: "super_secure_password", domain: "hq_mainframe" }, null, 2),
      headers: JSON.stringify({ "Content-Type": "application/json" }, null, 2)
    }
  },
  {
    id: 'mid-text',
    type: 'TEXT',
    content: "### Data Retrieval\nNow that we have a token, let's fetch the sensitive user profile data."
  },
  {
    id: 'req-data',
    type: 'REQUEST',
    isExpanded: true,
    requestConfig: {
      mode: 'REST',
      method: 'GET',
      endpoint: '/api/v1/users/profile?include_secrets=true',
      body: '',
      headers: JSON.stringify({ "Authorization": "Bearer eyJhbGciOi...", "Content-Type": "application/json" }, null, 2)
    }
  }
];

export const useNotebookState = () => {
  const [cells, setCells] = useState<NotebookCell[]>(INITIAL_CELLS);

  const addRequestCell = useCallback(() => {
    const newCell: NotebookCell = {
      id: `req-${Date.now()}`,
      type: 'REQUEST',
      isExpanded: true,
      layout: 'SPLIT',
      requestConfig: {
        mode: 'REST',
        method: 'GET',
        endpoint: '/api/new-endpoint',
        body: '{}',
        headers: '{\n  "Content-Type": "application/json"\n}'
      }
    };
    setCells(prev => [...prev, newCell]);
  }, []);

  const addTextCell = useCallback(() => {
    const newCell: NotebookCell = {
      id: `txt-${Date.now()}`,
      type: 'TEXT',
      content: 'Add your notes here...'
    };
    setCells(prev => [...prev, newCell]);
  }, []);

  const addRowCell = useCallback(() => {
    const newCell: NotebookCell = {
      id: `row-${Date.now()}`,
      type: 'ROW',
      content: '### Documentation\nExplain the request on the right...',
      requestConfig: {
        mode: 'REST',
        method: 'GET',
        endpoint: '/api/split-row-example',
        body: '{}',
        headers: '{\n  "Content-Type": "application/json"\n}'
      }
    };
    setCells(prev => [...prev, newCell]);
  }, []);

  const deleteCell = useCallback((id: string) => {
    setCells(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateTextCell = useCallback((id: string, content: string) => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, content } : c));
  }, []);

  const updateRequestConfig = useCallback((id: string, config: RequestConfig) => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, requestConfig: config } : c));
  }, []);

  const updateCellResponse = useCallback((id: string, response: SimulatedResponse | null) => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, response } : c));
  }, []);

  const updateCellLayout = useCallback((id: string, layout: 'SPLIT' | 'STACKED') => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, layout } : c));
  }, []);

  return {
    cells,
    setCells,
    addRequestCell,
    addTextCell,
    addRowCell,
    deleteCell,
    updateTextCell,
    updateRequestConfig,
    updateCellResponse,
    updateCellLayout
  };
};
