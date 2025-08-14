export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: any;
    color?: string;
  }>;
  label?: any;
  coordinate?: {
    x: number;
    y: number;
  };
}
