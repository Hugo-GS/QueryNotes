
import { RequestConfig } from "../request/types";
import { SimulatedResponse } from "../../shared/types";

export type CellType = 'TEXT' | 'REQUEST' | 'ROW';

export interface NotebookCell {
  id: string;
  type: CellType;
  content?: string; // For text cells and ROW cells (text part)
  requestConfig?: RequestConfig; // For request cells and ROW cells (request part)
  response?: SimulatedResponse | null; // Store the last execution response
  isExpanded?: boolean;
  layout?: 'SPLIT' | 'STACKED';
}
