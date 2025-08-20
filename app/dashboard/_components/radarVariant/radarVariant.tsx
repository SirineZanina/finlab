import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer
} from 'recharts';
import { RadarVariantProps } from './radar-variant.types';

const RadarVariant = ({
  data
} : RadarVariantProps) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <RadarChart
	  	cx='50%'
        cy='50%'
        outerRadius='60%'
        data={data}
	  >
        <PolarGrid />
        <PolarAngleAxis
          style={{
            fontSize: '12px'
          }}
          dataKey='name'
        />
        <PolarAngleAxis
          style={{
            fontSize: '12px'
          }}
        />
        <Radar
          dataKey='value'
		  stroke='#31b099'
		  fill='#31b099'
		  fillOpacity={0.6}
        />
	  </RadarChart>

    </ResponsiveContainer>

  );
};

export default RadarVariant;
