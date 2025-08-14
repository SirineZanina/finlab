import { format } from 'date-fns';
import {
  Tooltip,
  XAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  YAxis
} from 'recharts';
import { LineVariantProps } from './line-variant.types';
import CustomTooltip from '@/components/shared/custom-tooltip/custom-tooltip';

const LineVarient = ({
  data
} : LineVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <defs>
          <linearGradient id='income' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='2%' stopColor='#31b099' stopOpacity={0.8} />
            <stop offset='98%' stopColor='#31b099' stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id='expenses' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='2%' stopColor='#c65468' stopOpacity={0.8} />
            <stop offset='98%' stopColor='#c65468' stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray='none'
          stroke='#f1f5f9'
          horizontal={true}
          vertical={false}
        />

        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey='date'
          tickFormatter={(value) => format(new Date(value), 'dd MMM')}
          style={{
            fontSize: '12px',
            fill: '#64748b',
            fontWeight: '500'
          }}
          tickMargin={16}
          interval="preserveStartEnd"
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          style={{
            fontSize: '12px',
            fill: '#64748b',
            fontWeight: '500'
          }}
          tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
          tickMargin={12}
          width={50}
          domain={[0, 'dataMax + 1000']}
        />

        <Tooltip content={<CustomTooltip  />} />

        <Line
          dot={false}
	 	  dataKey='income'
          stroke='#31b099'
		  strokeWidth={2}
          className='drop-shadow-xs'
        />
        <Line
          dot={false}
	 	  dataKey='expenses'
          stroke='#c65468'
		  strokeWidth={2}
          className='drop-shadow-xs'
        />
      </LineChart>

    </ResponsiveContainer>
  );
};

export default LineVarient;
