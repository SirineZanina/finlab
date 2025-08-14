import React, { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { FileSearch, PieChart, Radar, Target } from 'lucide-react';

import { SpendingPieProps } from './spending-pie.types';
import RadarVariant from '@/components/shared/radar-variant/radar-variant';
import PieVariant from '@/components/shared/pie-variant/pie-variant';
import RadialVariant from '@/components/shared/radial-variant/radial-variant';

const SpendingPie = ({
  data = [],
  totalCategories
} : SpendingPieProps) => {

  const [chartType, setChartType] = useState('pie');

  const onTypeChange = (type: string) => {
    // TODO: Add paywall
    setChartType(type);
  };

  return (
    <Card className='border-none drop-shadow-sm'>
	  <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
        <CardTitle className='text-xl line-clamp-1'>
			Top Categories
        </CardTitle>
        <Select
		  defaultValue={chartType}
		  onValueChange={onTypeChange}
        >
		  <SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
            <SelectValue placeholder='Chart Type' />
		  </SelectTrigger>
		  <SelectContent>
            <SelectItem value='pie'>
			  <div className='flex items-center'>
                <PieChart className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>
					Pie Chart
                </p>
			  </div>
            </SelectItem>
			 <SelectItem value='radar'>
			  <div className='flex items-center'>
                <Radar className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>
					Radar Chart
                </p>
			  </div>
            </SelectItem>
				 <SelectItem value='radial'>
			  <div className='flex items-center'>
                <Target className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>
					Radial Chart
                </p>
			  </div>
            </SelectItem>
		  </SelectContent>
        </Select>
	  </CardHeader>

	  <CardContent>
        {data.length === 0 ? (
		  <div className='flex flex-col gpa-y-4 items-center justify-center h-[350px] w-full'>
            <FileSearch className='size-6 text-muted-foreground' />
            <p className='text-muted-foreground text-sm'>
					No data for this period.
            </p>
		  </div>
        ) : (
		  <>
            {chartType === 'pie' && <PieVariant data={data} totalCategories={totalCategories} />}
            {chartType === 'radar' && <RadarVariant data={data} />}
            {chartType === 'radial' && <RadialVariant data={data} />}
		  </>
        )}
	  </CardContent>
    </Card>
  );
};

export default SpendingPie;
