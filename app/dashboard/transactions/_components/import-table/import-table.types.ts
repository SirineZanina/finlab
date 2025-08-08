export type ImportTableProps = {
	headers: string[];
	body: string[][];
	selectedColumns: Record<string, string | null>;
	onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
}
