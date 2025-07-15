'use client';
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { DoughnutChartProps } from './doghnutChart.types';
import { data } from './doghnutChart.utils';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts } : DoughnutChartProps) => {
  return (
	 <Doughnut
	 data={data}
	 options={{
        cutout: '60%',
        plugins: {
          legend: {
            display: false
          }
        }
	 }}
	 />
  );
};

export default DoughnutChart;
