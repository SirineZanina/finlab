import React, { useState } from 'react';
// Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImportTable from '@/app/dashboard/transactions/_components/import-table/import-table';
// Utils
import { format, parse } from 'date-fns';
import { convertAmountToMiliunits } from '@/lib/utils';
// Types
import {
  ImportCardProps,
  dateFormat,
  outputFormat,
  requiredOptions,
  SelectedColumnsState,
  TransactionData
} from './import-card.types';

const ImportCard = ({
  data,
  onCancel,
  onSubmit
} : ImportCardProps) => {

  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumns((prevState) => {
      const newSelectedColumns = { ...prevState };

      for (const key in newSelectedColumns) {
		  if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null; // Clear the previous selection
		  }
      }
	  if (value === 'skip'){
        value = null;
	  }

	  newSelectedColumns[`column_${columnIndex}`] = value;
	  return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split('_')[1];
    };

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
	  body: body.map((row) => {
        const transformedRow = row.map((cell, index) => {
          const columnIndex = getColumnIndex(`column_${index}`);
          return selectedColumns[`column_${columnIndex}`] ? cell : null;
        });

        return transformedRow.every((item) => item === null)
          ? []
          : transformedRow;
	  }).filter((row) => row.length > 0)
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((accumulater: TransactionData, cell, index ) => {
        const header = mappedData.headers[index];
        if (header !== null && cell !== null) {
          accumulater[header] = cell;
        }
        return accumulater;
      }, {});
    });

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount)),
	  date: format(parse(item.date, dateFormat, new Date()), outputFormat),
    }));

    console.log('Formatted Data:', formattedData);

    onSubmit(formattedData);
  };

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 '>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
		  <CardTitle className='text-xl line-clamp-1'>
			Import Transactions
          </CardTitle>
		  <div className='flex flex-col w-full lg:w-auto lg:flex-row gap-2'>
            <Button
              onClick={onCancel}
			  size='sm'
              className='w-full lg:w-auto'
			  >
				Cancel
            </Button>
            <Button
			  size='sm'
			  onClick={handleContinue}
			  className='w-full lg:w-auto'
              disabled={progress < requiredOptions.length}
			  >
				Continue ({progress} / {requiredOptions.length})
            </Button>
		  </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportCard;
