import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import CategoryTooltip from '@/app/dashboard/_components/category-tooltip/category-tooltip';
import { formatPercentage } from '@/lib/utils';
import { COLORS } from './pie-variant.constants';
import { PieVariantProps } from './pie-variant.types';

const PieVariant = ({ data, totalCategories }: PieVariantProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Custom label function that renders the center content
  const renderCenterLabel = () => {
    return (
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
        <tspan x="50%" dy="-2em" fontSize="28" fontWeight="bold" fill="#1f2937">
          {totalCategories}
        </tspan>
        <tspan x="50%" dy="2em" fontSize="14" fill="#6b7280">
          {totalCategories === 1 ? 'Category' : 'Categories'}
        </tspan>
      </text>
    );
  };

  return (
    <ResponsiveContainer width='100%' height={350}>
      <PieChart>
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
                  const percentage = dataEntry ? (dataEntry.value / total) * 100 : 0;
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
                          {formatPercentage(percentage)}
                        </span>
                      </div>
                    </li>
                  );})}
              </ul>
            );
          }}
        />
        <Tooltip
          content={<CategoryTooltip />}
        />
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          fill='#8884d8'
          dataKey='value'
          labelLine={false}
          label={renderCenterLabel}
        >
          {data.map((_entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieVariant;
