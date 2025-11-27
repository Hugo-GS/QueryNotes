
export interface RequestConfig {
  mode: 'REST' | 'GRAPHQL' | 'SOAP';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  body: string;
  headers: string;
}
