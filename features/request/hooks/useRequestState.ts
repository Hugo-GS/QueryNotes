import { useState, useEffect, useRef } from 'react';
import { RequestConfig } from '../types';
import { SimulatedResponse } from '../../../shared/types';
import { simulateBackendRequest } from '../../simulation/backend';

interface UseRequestStateProps {
  initialConfig: RequestConfig;
  initialResponse?: SimulatedResponse | null;
  onConfigChange?: (config: RequestConfig) => void;
  onResponseChange?: (response: SimulatedResponse | null) => void;
  environmentUrl?: string;
}

export const useRequestState = ({
  initialConfig,
  initialResponse,
  onConfigChange,
  onResponseChange,
  environmentUrl
}: UseRequestStateProps) => {
  const [config, setConfig] = useState<RequestConfig>(initialConfig);
  const [response, setResponse] = useState<SimulatedResponse | null>(initialResponse || null);
  const [loading, setLoading] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const prevConfigRef = useRef<string>(JSON.stringify(initialConfig));

  // Sync with parent's initialResponse
  useEffect(() => {
    setResponse(initialResponse || null);
  }, [initialResponse]);

  // Sync with parent's initialConfig (deep comparison)
  useEffect(() => {
    const newConfigString = JSON.stringify(initialConfig);
    if (newConfigString !== prevConfigRef.current) {
      prevConfigRef.current = newConfigString;
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  // Notify parent of config changes
  useEffect(() => {
    const currentConfigString = JSON.stringify(config);
    if (currentConfigString !== prevConfigRef.current) {
      prevConfigRef.current = currentConfigString;
      onConfigChange?.(config);
    }
  }, [config, onConfigChange]);

  const handleSend = async () => {
    setLoading(true);

    try {
      const result = await simulateBackendRequest(
        config.mode,
        config.method,
        config.endpoint,
        config.body,
        config.headers,
        environmentUrl
      );

      setResponse(result);
      onResponseChange?.(result);
      return result;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validateJson = (value: string) => {
    if (!value.trim()) {
      setJsonError(null);
      return true;
    }
    try {
      JSON.parse(value);
      setJsonError(null);
      return true;
    } catch (e: any) {
      setJsonError(e.message);
      return false;
    }
  };

  return {
    config,
    setConfig,
    response,
    loading,
    jsonError,
    setJsonError,
    handleSend,
    validateJson
  };
};
