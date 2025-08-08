export type TableHeadSelectProps = {
	columnIndex: number;
	selectedColumns: Record<string, string | null>;
	onChange: (
		columnIndex: number,
		value: string | null
	) => void;
}

export const options = [
  'amount',
  'payee',
  //   'notes', // extra field
  'date',
];
