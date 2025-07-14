import React from 'react';
import Image from 'next/image';
import { testimonials } from './testimonials.constants';
import { twMerge } from 'tailwind-merge';

const TestimonialsColumn = (props: { className?: string; testimonials: typeof testimonials}) => {
  return (
    <div className={twMerge('lex flex-col gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]',
      props.className)}>
      {props.testimonials.map((testimonial, index) => (
        <div className='card' key={index}>
          <div>{testimonial.text}</div>
          <div className='flex items-center gap-2 mt-5'>
            <Image
              src={testimonial.imageSrc}
              alt={testimonial.name}
              width={4000} height={4000}
              className='h-10 w-10 rounded-full object-cover'
            />
            <div className='flex flex-col'>
              <p className='font-medium tracking-tight leading-5'>{testimonial.name}</p>
              <p className='leading-5 tracking-tight'>{testimonial.username}</p>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default TestimonialsColumn;
