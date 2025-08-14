import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AnimatedCounter from '@/components/shared/animated-counter/animated-counter';
import { cn, formatPercentage } from '@/lib/utils';
import { boxVariant, iconVariant } from './data-card.utils';
import { DataCardProps } from './data-card.types';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DataCard = ({
  icon: Icon,
  title,
  variant,
  value = 0,
  dateRange,
  percentageChange = 0,
}: DataCardProps) => {
  const isPositive = percentageChange >= 0;
  const isNegative = percentageChange < 0;

  return (
    <Card className='border border-secondary-200 bg-white rounded-2xl'>
      <CardHeader className='flex flex-row items-start justify-between gap-x-4'>
        <div className='flex flex-col gap-1 flex-1'>
          <CardDescription className='text-secondary-500 text-base font-bold uppercase tracking-wide'>
            {title}
          </CardDescription>
          <CardTitle className='text-secondary-400 text-xs font-normal'>
            {dateRange}
          </CardTitle>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col gap-4'>
          <h1 className='font-bold text-3xl text-secondary-500 line-clamp-1 break-all'>
            <AnimatedCounter amount={value} />
          </h1>

          <div className='flex items-center gap-1'>
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold',
              isPositive ? 'bg-primary-100 text-primary-700' :
                isNegative ? 'bg-error-100 text-error-700' :
                  'bg-secondary-100 text-secondary-400'
            )}>
              {isPositive ? (
                <TrendingUp size={12} />
              ) : isNegative ? (
                <TrendingDown size={12} />
              ) : null}
              <span>{formatPercentage(Math.abs(percentageChange))}</span>
            </div>
            <span className='text-secondary-400 text-xs'>
              from last month
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
