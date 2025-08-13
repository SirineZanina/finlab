'use client';

import DataCharts from '@/components/shared/data-chart/data-charts';
import DataGrid from '@/components/shared/data-grid/data-grid';

const DashboardPage = () => {

  return (
    <section className='max-w-screen-2xl mx-auto w-full pb-10'>
      <DataGrid />
	  <DataCharts />
    </section>
  );
};

export default DashboardPage;
