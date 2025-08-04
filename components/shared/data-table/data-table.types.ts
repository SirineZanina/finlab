import { ColumnDef, Row } from '@tanstack/react-table';
import React from 'react';

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterKey: string;
  onDelete: (_rows: Row<TData>[]) => void;
  disabled?: boolean;
  headerContent?: React.ReactNode
  deleteEntityName?: string;
  deleteEntityNamePlural?: string;
}
