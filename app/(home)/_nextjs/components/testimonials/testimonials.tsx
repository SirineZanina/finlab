import React from 'react';
import { firstColumn, secondColumn, thirdColumn } from './testimonials.constants';
import TestimonialsColumn from './testimonialsColumn';

const Testimonials = () => {
  return (
    <section className='bg-white'>
      <div className='container'>
        <div className='section-heading text-center'>
		 <div className='flex justify-center'>
            <div className='tag'>Testimonials</div>
          </div>
          <h2 className='section-title mt-5'>What our users say</h2>
          <p className='section-description mt-5'>
			From intuitive design to powerful features, our app has become an essential tool
			for users around the world
          </p>
	   </div>
        <div className='flex justify-center gap-6'>
          <TestimonialsColumn testimonials={firstColumn} />
		  <TestimonialsColumn className='hidden md:flex' testimonials={secondColumn} />
		  <TestimonialsColumn className='hidden lg:flex' testimonials={thirdColumn} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
