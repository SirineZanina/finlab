import { format } from 'date-fns';

import { formatAmount } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { CustomTooltipProps } from './custom-tooltip.types';

const CustomTooltip = ({
  active,
  payload,
  label
}: CustomTooltipProps) => {
  // Check if tooltip should be active and has data
  if (!active || !payload || payload.length === 0) return null;

  // Get the date from either label or payload
  const date = label || payload[0]?.payload?.date;
  if (!date) return null;

  // Find income and expenses from payload
  const incomeData = payload.find(p => p.dataKey === 'income');
  const expensesData = payload.find(p => p.dataKey === 'expenses');

  const income = incomeData?.value || 0;
  const expenses = expensesData?.value || 0;

  return (
    <div className='rounded-sm bg-white shadow-sm border overflow-hidden'>
      <div className='text-sm p-2 px-3 bg-muted text-muted-foreground'>
        {format(new Date(date), 'MMM dd, yyyy')}
      </div>
      <Separator />
      <div className='p-2 px-3 space-y-1'>
        <div className='flex items-center justify-between gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <div className='size-1.5 bg-blue-500 rounded-full' />
            <p className='text-sm text-muted-foreground'>
              Income
            </p>
          </div>
          <p className='text-sm text-right font-medium'>
            {formatAmount(income)}
          </p>
        </div>
      </div>
      <div className='p-2 px-3 space-y-1'>
        <div className='flex items-center justify-between gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <div className='size-1.5 bg-rose-500 rounded-full' />
            <p className='text-sm text-muted-foreground'>
              Expenses
            </p>
          </div>
          <p className='text-sm text-right font-medium'>
            {formatAmount(expenses * -1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
