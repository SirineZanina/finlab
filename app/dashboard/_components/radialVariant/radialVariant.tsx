import {
  RadialBar,
  RadialBarChart,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatAmount } from '@/lib/utils';
import { COLORS } from './radialVariant.contants';
import { RadialVariantProps } from './radialVariant.types';

const RadialVariant = ({ data }: RadialVariantProps) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <RadialBarChart
        cx='50%'
        cy='30%'
        barSize={10}
        innerRadius={90}
        outerRadius={40}
        data={data.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length]
        }))}
      >
        <RadialBar
          label={{
            position: 'insideStart',
            fill: '#fff',
            fontSize: '12px',
          }}
          background
          dataKey='value'
        />
        <Legend
          layout='horizontal'
          verticalAlign='bottom'
          align='right'
          iconType='circle'
          content={({ payload }) => {
            return (
              <ul className='flex flex-col space-y-2'>
                {payload && payload.map((entry, index) => {
                  const dataEntry = data[index];
                  const amount = dataEntry?.value || 0;

                  return(
                    <li key={`item-${index}`} className='flex items-center space-x-2'>
                      <span
                        className='size-2 rounded-full'
                        style={{ backgroundColor: entry.color }}
                      />
                      <div className='space-x-2'>
                        <span className='text-sm text-muted-background'>
                          {entry.value}
                        </span>
                        <span
                          className='text-xs font-semibold text-white px-2.5 py-1 rounded-full shadow-sm transition-all duration-200 group-hover:shadow-md'
                          style={{
                            backgroundColor: entry.color,
                            opacity: 0.9
                          }}
                        >
                          {formatAmount(amount)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            );
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default RadialVariant;
