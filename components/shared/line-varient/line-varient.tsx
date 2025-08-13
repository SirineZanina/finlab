import { format } from 'date-fns';
import {
  Tooltip,
  XAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { LineVarientProps } from './line-varient.types';
import CustomTooltip from '@/components/shared/custom-tooltip/custom-tooltip';

const LineVarient = ({
  data
} : LineVarientProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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

        <Line
          dot={false}
	 	  dataKey='income'
          stroke='#3b82f6'
		  strokeWidth={2}
          className='drop-shadow-sm'
        />
        <Line
          dot={false}
	 	  dataKey='expenses'
          stroke='#f43f5e'
		  strokeWidth={2}
          className='drop-shadow-sm'
        />
      </LineChart>

    </ResponsiveContainer>
  );
};

export default LineVarient;
