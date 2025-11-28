import React, { useState } from 'react';
import { RequestConfig } from './types';
import { SimulatedResponse } from '../../shared/types';
import { useRequestState } from './hooks/useRequestState';
import { useRequestTabs } from './hooks/useRequestTabs';
import { useFormBuilder } from './hooks/useFormBuilder';
import { RequestToolbar } from './components/RequestToolbar';
import { RequestComposer } from './components/RequestComposer';
import { ResponseViewer } from './components/ResponseViewer';

interface RequestCellProps {
  id: string;
  initialConfig: RequestConfig;
  initialResponse?: SimulatedResponse | null;
  onDelete: () => void;
  onConfigChange?: (config: RequestConfig) => void;
  onResponseChange?: (response: SimulatedResponse | null) => void;
  readOnly?: boolean;
  layout?: 'SPLIT' | 'STACKED';
  environmentUrl?: string;
}

export const RequestCell: React.FC<RequestCellProps> = ({
  id,
  initialConfig,
  initialResponse,
  onDelete,
  onConfigChange,
  onResponseChange,
  readOnly,
  layout = 'SPLIT',
  environmentUrl
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isStacked = layout === 'STACKED';

  // Custom hooks
  const { config, setConfig, response, loading, jsonError, setJsonError, handleSend, validateJson } = useRequestState({
    initialConfig,
    initialResponse,
    onConfigChange,
    onResponseChange,
    environmentUrl
  });

  const { leftTab, setLeftTab, rightTab, setRightTab, inputMode, setInputMode, switchToAppropriateTab } =
    useRequestTabs({ isStacked });

  const { formRows, handleFormChange, addFormRow, removeFormRow } = useFormBuilder();

  // Helper functions
  const getFullUrl = () => {
    if (!environmentUrl || config.endpoint.startsWith('http://') || config.endpoint.startsWith('https://')) {
      return config.endpoint;
    }
    const baseUrl = environmentUrl.endsWith('/') ? environmentUrl.slice(0, -1) : environmentUrl;
    const path = config.endpoint.startsWith('/') ? config.endpoint : `/${config.endpoint}`;
    return `${baseUrl}${path}`;
  };

  const requestLanguage = config.mode === 'GRAPHQL' ? 'graphql' : config.mode === 'SOAP' ? 'xml' : 'json';
  const responseLanguage = config.mode === 'SOAP' ? 'xml' : 'json';

  // Handlers
  const handleModeSwitch = (mode: 'REST' | 'GRAPHQL' | 'SOAP') => {
    if (mode === 'GRAPHQL') {
      setConfig((prev) => ({
        ...prev,
        mode: 'GRAPHQL',
        method: 'POST',
        endpoint: '/graphql',
        body:
          prev.mode === 'GRAPHQL'
            ? prev.body
            : `query {\n  user(id: "123") {\n    name\n    email\n  }\n}`,
        headers: '{\n  "Content-Type": "application/json"\n}'
      }));
      setInputMode('RAW');
      setJsonError(null);
    } else if (mode === 'SOAP') {
      setConfig((prev) => ({
        ...prev,
        mode: 'SOAP',
        method: 'POST',
        endpoint: '/service/soap-endpoint',
        body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.example.com/webservice">
  <soapenv:Header/>
  <soapenv:Body>
    <web:GetData>
      <web:id>123</web:id>
    </web:GetData>
  </soapenv:Body>
</soapenv:Envelope>`,
        headers: '{\n  "Content-Type": "application/soap+xml"\n}'
      }));
      setInputMode('RAW');
      setJsonError(null);
    } else {
      setConfig((prev) => ({
        ...prev,
        mode: 'REST',
        method: 'GET',
        endpoint: '/api/v1/resource',
        body: '{}',
        headers: '{\n  "Content-Type": "application/json"\n}'
      }));
    }
  };

  const handleBodyChange = (value: string) => {
    setConfig({ ...config, body: value });

    // Only validate JSON in REST mode
    if (config.mode === 'REST') {
      validateJson(value);
    } else {
      setJsonError(null);
    }
  };

  const handleHeadersChange = (value: string) => {
    setConfig({ ...config, headers: value });
  };

  const onFormChangeWrapper = (id: string, field: 'key' | 'value', newValue: string) => {
    const jsonString = handleFormChange(id, field, newValue);
    setConfig((prev) => ({ ...prev, body: jsonString }));
    setJsonError(null);
  };

  const onAddFormRowWrapper = () => {
    addFormRow();
  };

  const onRemoveFormRowWrapper = (id: string) => {
    const jsonString = removeFormRow(id);
    setConfig((prev) => ({ ...prev, body: jsonString }));
  };

  const onSendWrapper = async () => {
    if (!isExpanded) setIsExpanded(true);
    const result = await handleSend();
    if (result) {
      switchToAppropriateTab(result.status);
    }
  };

  return (
    <div className="border border-lab-border rounded-lg bg-lab-panel overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-lab-border/80">
      <RequestToolbar
        isExpanded={isExpanded}
        loading={loading}
        config={config}
        readOnly={readOnly}
        environmentUrl={environmentUrl}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onConfigChange={setConfig}
        onSend={onSendWrapper}
        onDelete={onDelete}
        getFullUrl={getFullUrl}
      />

      {isExpanded && (
        <div
          className={`flex flex-col ${isStacked ? '' : 'lg:flex-row'} ${
            isStacked ? 'h-auto' : 'h-auto lg:h-[450px]'
          } divide-y ${isStacked ? 'divide-lab-border' : 'lg:divide-y-0 lg:divide-x divide-lab-border'}`}
        >
          {/* LEFT: Request Composer (HIDDEN IN STACKED MODE) */}
          {!isStacked && (
            <RequestComposer
              config={config}
              leftTab={leftTab}
              inputMode={inputMode}
              formRows={formRows}
              jsonError={jsonError}
              readOnly={readOnly}
              requestLanguage={requestLanguage}
              onLeftTabChange={setLeftTab}
              onInputModeChange={setInputMode}
              onBodyChange={handleBodyChange}
              onHeadersChange={handleHeadersChange}
              onModeSwitch={handleModeSwitch}
              onFormChange={onFormChangeWrapper}
              onAddFormRow={onAddFormRowWrapper}
              onRemoveFormRow={onRemoveFormRowWrapper}
            />
          )}

          {/* RIGHT: Response Analysis */}
          <div
            className={`${
              isStacked ? 'w-full h-[600px]' : 'flex-col lg:flex-1 flex min-w-0 h-[500px] lg:h-auto'
            } bg-lab-bg/50 flex flex-col`}
          >
            <ResponseViewer
              response={response}
              rightTab={rightTab}
              responseLanguage={responseLanguage}
              onRightTabChange={setRightTab}
            />
          </div>
        </div>
      )}
    </div>
  );
};
