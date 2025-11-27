
export interface SimulatedResponse {
  status: number;
  statusText: string;
  latency: number; // in ms
  headers: Record<string, string>;
  body: any;
  logs: LogEntry[];
  sql?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

export interface RequestConfig {
  mode: 'REST' | 'GRAPHQL';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  body: string;
  headers: string;
}

export interface MetricPoint {
  time: string;
  latency: number;
  status: number;
}

export type CellType = 'TEXT' | 'REQUEST';

export interface NotebookCell {
  id: string;
  type: CellType;
  content?: string; // For text cells
  requestConfig?: RequestConfig; // For request cells
  isExpanded?: boolean;
}
