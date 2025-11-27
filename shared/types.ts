
export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

export interface SimulatedResponse {
  status: number;
  statusText: string;
  latency: number; // in ms
  headers: Record<string, string>;
  body: any;
  logs: LogEntry[];
  sql?: string;
}

export interface RequestConfig {
  mode: 'REST' | 'GRAPHQL' | 'SOAP';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  body: string;
  headers: string;
}
