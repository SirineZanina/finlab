'use client';

import DataCharts from '@/app/dashboard/_components/dataChart/dataCharts';
import DataGrid from '@/app/dashboard/_components/dataGrid';

const DashboardPage = () => {

  return (
    <section className='max-w-screen-2xl mx-auto w-full pb-10 flex flex-col gap-6'>
      <DataGrid />
	  <DataCharts />
    </section>
  );
};

export default DashboardPage;
