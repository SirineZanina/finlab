import { format } from 'date-fns';
import { formatAmount } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { CustomTooltipProps } from './customTooltip.types';

const CustomTooltip = ({
  active,
  payload,
}: CustomTooltipProps) => {
  // Check if tooltip should be active and has data
  if (!active || !payload || payload.length === 0) return null;

  // Get the date from either label or payload
  const date = payload[0]?.payload?.date;
  if (!date) return null;

  // Find income and expenses from payload
  const incomeData = payload.find(p => p.dataKey === 'income');
  const expensesData = payload.find(p => p.dataKey === 'expenses');

  const income = incomeData?.value || 0;
  const expenses = expensesData?.value || 0;

  return (
    <div className='rounded-md bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200/50 overflow-hidden'>
      <div className='text-sm p-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-medium'>
        {format(new Date(date), 'MMM dd, yyyy')}
      </div>
      <Separator className='bg-gray-200/50' />
      <div className='p-3 px-4 space-y-3'>
        <div className='flex items-center justify-between gap-x-4'>
          <div className='flex items-center gap-x-3'>
            <div className='size-2 bg-primary-500 rounded-full shadow-sm' />
            <p className='text-sm text-gray-600 font-medium'>
              Income
            </p>
          </div>
          <p className='text-sm text-right font-semibold text-gray-900'>
            {formatAmount(income)}
          </p>
        </div>

        <div className='flex items-center justify-between gap-x-4'>
          <div className='flex items-center gap-x-3'>
            <div className='size-2 bg-error-500 rounded-full shadow-sm' />
            <p className='text-sm text-gray-600 font-medium'>
              Expenses
            </p>
          </div>
          <p className='text-sm text-right font-semibold text-gray-900'>
            {formatAmount(expenses * -1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
