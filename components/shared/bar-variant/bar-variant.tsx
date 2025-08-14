import { format } from 'date-fns';
import {
  Tooltip,
  XAxis,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  YAxis
} from 'recharts';
import { BarVariantProps } from './bar-variant.types';
import CustomTooltip from '@/components/shared/custom-tooltip/custom-tooltip';

const BarVariant = ({
  data
} : BarVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
        <Tooltip content={<CustomTooltip />} />

        <Bar
	 	  dataKey='income'
          fill='#31b099'
          className='drop-shadow-xs'
        />
        <Bar
	 	  dataKey='expenses'
          fill='#c65468'
          className='drop-shadow-xs'
        />
      </BarChart>

    </ResponsiveContainer>
  );
};

export default BarVariant;
