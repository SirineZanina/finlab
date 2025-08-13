import { format } from 'date-fns';
import {
  Tooltip,
  XAxis,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { BarVariantProps } from './bar-varient.types';
import CustomTooltip from '@/components/shared/custom-tooltip/custom-tooltip';

const BarVarient = ({
  data
} : BarVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <defs>
          <linearGradient id='income' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='2%' stopColor='#3d82f6' stopOpacity={0.8} />
            <stop offset='98%' stopColor='#3d82f6' stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id='expenses' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='2%' stopColor='#f43f5e' stopOpacity={0.8} />
            <stop offset='98%' stopColor='#f43f5e' stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray='3 3' />

        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey='date'
          tickFormatter={(value) => format(new Date(value), 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip  />} />

        <Bar
	 	  dataKey='income'
          fill='#3b82f6'
          className='drop-shadow-sm'
        />
        <Bar
	 	  dataKey='expenses'
          fill='#f43f5e'
          className='drop-shadow-sm'
        />
      </BarChart>

    </ResponsiveContainer>
  );
};

export default BarVarient;
