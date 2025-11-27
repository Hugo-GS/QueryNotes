
import { GoogleGenAI } from "@google/genai";
import { SimulatedResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simulateBackendRequest = async (
  mode: 'REST' | 'GRAPHQL',
  method: string,
  endpoint: string,
  body: string
): Promise<SimulatedResponse> => {
  
  const isGql = mode === 'GRAPHQL';

  const prompt = `
    Act as a sophisticated backend server (${isGql ? 'GraphQL API' : 'REST API'}). 
    The user is making a request to: ${method} ${endpoint}.
    The request payload/body is: 
    ${body || '(empty)'}

    Analyze the request context and generate a REALISTIC response.

    ${isGql ? 
    `Rules for GraphQL:
     1. If the body contains a 'query', return a standard GraphQL JSON response: { "data": { ... } } or { "errors": [...] }.
     2. If it is a mutation, simulate the state change.
     3. If the syntax is clearly broken, return a syntax error.` 
    : 
    `Rules for REST:
     1. If the endpoint suggests a successful operation, return 200/201.
     2. If it looks invalid, return 400/401/404/500 appropriately.`
    }
    
    General Rules:
    1. Generate realistic JSON response body data.
    2. Generate realistic server-side logs (INFO, DEBUG, SQL queries).
    3. Simulate a realistic latency in milliseconds (between 20ms and 500ms).
    
    CRITICAL: Return ONLY a valid JSON object with this exact structure:
    {
      "status": number,
      "statusText": string,
      "latency": number,
      "headers": { "Content-Type": "application/json", ...other headers },
      "body": { ... response payload ... },
      "logs": [ { "timestamp": "ISOString", "level": "INFO"|"WARN"|"ERROR"|"DEBUG", "message": "string" } ],
      "sql": "string (optional)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as SimulatedResponse;
  } catch (error) {
    console.error("Simulation failed", error);
    // Fallback response if AI fails
    return {
      status: 500,
      statusText: "Internal Server Error",
      latency: 0,
      headers: { "Content-Type": "application/json" },
      body: { error: "Simulation failed", details: String(error) },
      logs: [{ timestamp: new Date().toISOString(), level: "ERROR", message: "AI Simulation failed" }]
    };
  }
};
