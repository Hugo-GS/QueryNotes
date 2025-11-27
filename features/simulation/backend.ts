
import { SimulatedResponse, LogEntry } from '../../shared/types';

export const simulateBackendRequest = async (
  mode: 'REST' | 'GRAPHQL' | 'SOAP',
  method: string,
  endpoint: string,
  body: string,
  headersStr: string = '{}'
): Promise<SimulatedResponse> => {
  
  const start = performance.now();
  const logs: LogEntry[] = [];
  
  logs.push({ 
    timestamp: new Date().toISOString(), 
    level: 'INFO', 
    message: `Initializing ${mode} request to ${endpoint}` 
  });

  try {
    // 1. Validate URL
    if (!endpoint.startsWith('http')) {
        throw new Error("URL must start with http:// or https://");
    }

    // 2. Parse Headers
    let headers: Record<string, string> = {};
    try {
        if (headersStr && headersStr.trim()) {
            headers = JSON.parse(headersStr);
        }
    } catch (e) {
        logs.push({ 
            timestamp: new Date().toISOString(), 
            level: 'WARN', 
            message: "Failed to parse headers JSON. Using empty headers." 
        });
    }

    // 3. Prepare Request
    const fetchOptions: RequestInit = {
        method: method,
        headers: headers,
        mode: 'cors', // Depends on the target API supporting CORS
    };

    // Add body for non-GET/HEAD methods
    if (method !== 'GET' && method !== 'HEAD') {
        fetchOptions.body = body;
        logs.push({ timestamp: new Date().toISOString(), level: 'INFO', message: `Payload size: ${body.length} chars` });
    }

    logs.push({ timestamp: new Date().toISOString(), level: 'INFO', message: `Sending ${method} request...` });

    // 4. Execute Request
    const response = await fetch(endpoint, fetchOptions);
    
    // 5. Calculate Metrics
    const latency = Math.round(performance.now() - start);
    logs.push({ 
        timestamp: new Date().toISOString(), 
        level: 'INFO', 
        message: `Received response: ${response.status} ${response.statusText} in ${latency}ms` 
    });

    // 6. Process Response Body
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    let responseBody: any;

    try {
        // Try parsing as JSON if looks like JSON or header says so
        if (contentType.includes('application/json') || (text.startsWith('{') || text.startsWith('['))) {
            responseBody = JSON.parse(text);
        } else {
            responseBody = text; // Return raw string (HTML/XML/Plain)
        }
    } catch (e) {
        responseBody = text;
    }

    // 7. Extract Response Headers
    const resHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
        resHeaders[key] = val;
    });

    return {
      status: response.status,
      statusText: response.statusText,
      latency: latency,
      headers: resHeaders,
      body: responseBody,
      logs: logs,
      sql: undefined // Real APIs don't typically expose SQL traces
    };

  } catch (error: any) {
    const latency = Math.round(performance.now() - start);
    console.error("Request failed", error);
    
    logs.push({ 
        timestamp: new Date().toISOString(), 
        level: 'ERROR', 
        message: error.message || "Network Error"
    });
    
    // Add specific hint for common CORS error (which has no status code usually)
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        logs.push({ 
            timestamp: new Date().toISOString(), 
            level: 'WARN', 
            message: "CORS Error suspected. The target API might not allow requests from this origin."
        });
    }

    return {
      status: 0,
      statusText: "Network Error",
      latency: latency,
      headers: {},
      body: { 
          error: error.message,
          hint: "Check the URL, your network connection, or Cross-Origin Resource Sharing (CORS) policies of the target server."
      },
      logs: logs
    };
  }
};
