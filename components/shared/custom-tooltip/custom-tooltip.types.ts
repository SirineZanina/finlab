export type TooltipPayload = {
  value: number;
  dataKey: string;
  color: string;
  payload: {
    date: string;
    income: number;
    expenses: number;
  };
};

export type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};
