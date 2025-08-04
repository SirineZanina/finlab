'use client';

import { useState } from 'react';
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, TrashIcon } from 'lucide-react';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { useConfirm } from '@/hooks/use-confirm';
import { DataTableProps } from './data-table.types';

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  onDelete,
  disabled
}: DataTableProps<TData, TValue>) {

  const [ConfirmDialog, confirm] = useConfirm('','');

  const newAccount = useNewAccount();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
	  columnFilters,
	  rowSelection,
    }
  });

  return (
    <div>
      <ConfirmDialog />
      <div className="flex items-center justify-between	 py-4">
        <Input
          placeholder={`Filter by ${filterKey}`}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white"
        />
        <div className='flex items-center gap-2'>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              disabled={disabled}
		  	  size='sm'
              variant='outline'
              className='ml-auto font-normal text-xs'
			  onClick={async () => {
                const selectedCount = table.getFilteredSelectedRowModel().rows.length;
                const title = 'Are you sure?';
                const message = selectedCount === 1
                  ? 'You are about to delete this account. This action cannot be undone.'
                  : `You are about to delete ${selectedCount} accounts. This action cannot be undone.`;

                const ok = await confirm({ title, message });
                if (ok) {
                  onDelete(table.getFilteredSelectedRowModel().rows);
                }
                table.resetRowSelection();
              }}
			  >
              <TrashIcon className='size-4 mr-2'/>
				Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
          <Button onClick={() => {
            newAccount.onOpen();
          }} size="sm" >
            <Plus className='size-4 mr-2' />
			Add new
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

    </div>
  );
}
