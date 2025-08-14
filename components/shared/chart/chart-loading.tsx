import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const ChartLoading = () => {
  return (
    <Card className='border-none drop-shadow-sm'>
      <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-8 lg:w-[120px] w-full' />
      </CardHeader>
	  <CardContent>
        <div className='h-[350px] w-full flex items-center jusitfy-center'>
          <Loader2 className='size-6 text-slate-300 animate-spin' />
        </div>
	  </CardContent>

    </Card>

  );
};

export default ChartLoading;
