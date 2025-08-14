'use client';

import { useGetSummary } from '@/features/summary/api/use-get-summary';
import Chart from '@/components/shared/chart/chart';
import SpendingPie from '@/components/shared/spending-pie/spending-pie';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import ChartLoading from '@/components/shared/chart/chart-loading';
import SpendingPieLoading from '@/components/shared/spending-pie/spending-pie-loading';

const DataCharts = () => {
  const { data, isLoading } = useGetSummary();
  const { data: dataCategories } = useGetCategories();

  const totalCategories = dataCategories?.length || 0;

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-6 gap-6'>
        <div className='col-span-1 lg:col-span-3 xl:col-span-4'>
          <ChartLoading />
	 	</div>
        <div className='col-span-1 lg:col-span-3 xl:col-span-2'>
          <SpendingPieLoading />
        </div>
      </div>
    );
  }
  return (
    <div className='grid grid-cols-1 lg:grid-cols-6 gap-6'>
      <div className='col-span-1 lg:col-span-3 xl:col-span-4'>
        <Chart data={data?.days} />
	  </div>
	  <div className='col-span-1 lg:col-span-3 xl:col-span-2'>
        <SpendingPie
          data={data?.categories}
		  totalCategories={totalCategories}
        />
	  </div>
    </div>
  );
};

export default DataCharts;
