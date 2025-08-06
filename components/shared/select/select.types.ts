export type SelectProps ={
	onChange: (value?: string) => void;
	onCreate?: (value: string) => void;
	options?: { label: string; value: string }[];
	value?: string | null | undefined;
	disabled?: boolean;
	placeholder?: string;
}

export type Option = {
  label: string;
  value: string;
};
