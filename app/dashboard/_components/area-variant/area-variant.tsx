import { format } from 'date-fns';
import {
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { AreaVariantProps } from './area-variant.types';
import CustomTooltip from '@/components/shared/custom-tooltip/custom-tooltip';

const AreaVariant = ({ data }: AreaVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <defs>
          <linearGradient id='income' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#31b099' stopOpacity={0.4} />
            <stop offset='95%' stopColor='#31b099' stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id='expenses' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#c65468' stopOpacity={0.4} />
            <stop offset='95%' stopColor='#c65468' stopOpacity={0.05} />
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

        <Tooltip
          content={<CustomTooltip />}
          cursor={false}
        />

        <Area
          type='monotone'
          dataKey='income'
          stackId='1'
          strokeWidth={2.5}
          stroke='#31b099'
          fill='url(#income)'
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Area
          type='monotone'
          dataKey='expenses'
          stackId='2'
          strokeWidth={2.5}
          stroke='#c65468'
          fill='url(#expenses)'
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </AreaChart>
    </ResponsiveContainer>

  );
};

export default AreaVariant;
