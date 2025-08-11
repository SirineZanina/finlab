export type ImportCardProps = {
	data: string[][];
	onCancel: () => void;
	onSubmit: (data: formattedDataType[]) => void;
}

export type formattedDataType = {
	[key: string]: string | number;
}

export const dateFormat = 'yyyy-MM-dd HH:mm:ss';
export const outputFormat = 'yyyy-MM-dd';

export const requiredOptions = [
  'amount',
  'date',
  'payee'
];

export type SelectedColumnsState = {
	[key: string]: string | null;
}

export type TransactionData = {
  [key: string]: string;
};
