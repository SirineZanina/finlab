import React from 'react';
import Image from 'next/image';

const ProductShowcase = () => {
  return (
    <section className='bg-gradient-to-b from-[#FFFFFF] to-[#AFF7D5] py-24 overflow'>
      <div className='container'>
        <div className='max-w-[540px] mx-auto'>
		 <div className='flex justify-center'>
            <div className='tag'>Boost your finance management</div>
          </div>
          <h2 className='text-center text-3xl md:text-5xl md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-primary-600
		 	text-transparent bg-clip-text mt-5 pb-2'>
				A more effective way to track growth
          </h2>
          <p className='text-center text-sm sm:text-base xl:text-lg font-medium text-dark-blue mt-5'>
			With intuitive interfaces, real-time data insights, and robust security features, you can trust our app to keep your financial information safe while providing the tools you need to make informed decisions.
          </p>
	  	</div>
        <div className='flex justify-center mt-10'>
          <Image
            src={'/images/product-image.png'}
            alt="Product Image"
            width={1040}
            height={666}
          />
        </div>	   </div>
    </section>
  );
};

export default ProductShowcase;
