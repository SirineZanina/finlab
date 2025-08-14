export type TooltipPayload = {
  value: number;
  dataKey: string;
  color: string;
  payload: {
    name: string;
	value: number;
  };
};

export type CategoryTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};
