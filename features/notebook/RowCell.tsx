
import React from 'react';
import { TextCell } from './TextCell';
import { RequestCell } from '../request/RequestCell';
import { RequestConfig } from '../request/types';
import { SimulatedResponse } from '../../shared/types';

interface RowCellProps {
  id: string;
  textContent: string;
  requestConfig: RequestConfig;
  initialResponse?: SimulatedResponse | null;
  onTextUpdate: (content: string) => void;
  onConfigUpdate: (config: RequestConfig) => void;
  onResponseUpdate: (response: SimulatedResponse | null) => void;
  onDelete: () => void;
  readOnly?: boolean;
  layout?: 'SPLIT' | 'STACKED';
}

export const RowCell: React.FC<RowCellProps> = ({
  id,
  textContent,
  requestConfig,
  initialResponse,
  onTextUpdate,
  onConfigUpdate,
  onResponseUpdate,
  onDelete,
  readOnly,
  layout = 'SPLIT'
}) => {
  return (
    <div className="relative group/row animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Text Column (Left) - 35% on desktop */}
        <div className="w-full lg:w-[35%] min-w-0 pt-1">
             <div className="lg:sticky lg:top-24">
                <TextCell 
                    content={textContent}
                    onUpdate={onTextUpdate}
                    onDelete={onDelete}
                    readOnly={readOnly}
                />
             </div>
        </div>

        {/* Request Column (Right) - Flex 1 on desktop */}
        <div className="w-full lg:flex-1 min-w-0">
            <RequestCell 
                id={id}
                initialConfig={requestConfig}
                initialResponse={initialResponse}
                onDelete={onDelete}
                onConfigChange={onConfigUpdate}
                onResponseChange={onResponseUpdate}
                readOnly={readOnly}
                layout={layout} 
            />
        </div>
      </div>
    </div>
  );
};
