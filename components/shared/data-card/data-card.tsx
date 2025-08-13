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

const DataCard = ({
  icon: Icon,
  title,
  variant,
  value = 0,
  dateRange,
  percentageChange = 0,
} : DataCardProps) => {
  return (
    <Card className='border border-gray-100 bg-white'>
      <CardHeader className='flex flex-row items-center justify-between gap-x-4'>
        <div className='flex flex-col gap-2'>
		 <CardTitle className='text-xl line-clamp-1'>
            {title}
          </CardTitle>
          <CardDescription className='line-clamp-1'>
            {dateRange}
          </CardDescription>
	   </div>
	   <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
	   </div>
	  </CardHeader>
	  <CardContent>
        <h1 className='font-bold text-2xl mb-2 line-clamp-1 break-all'>
          <AnimatedCounter amount={value} />
        </h1>
        <p className={cn('text-muted-foreground text-sm line-clamp-1',
		  percentageChange < 0 ? 'text-rose-500' : 'text-emerald-500')}>
          <span className='font-bold'> {formatPercentage(percentageChange)} </span>from last month
        </p>
	  </CardContent>

    </Card>
  );
};

export default DataCard;
