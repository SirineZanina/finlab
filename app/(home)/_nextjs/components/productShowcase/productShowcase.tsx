import React from 'react';
import Image from 'next/image';

const ProductShowcase = () => {
  return (
    <section className='bg-gradient-to-b from-[#FFFFFF] to-[#AFF7D5] py-24 overflow'>
      <div className='container'>
        <div className='section-heading'>
		 <div className='flex justify-center'>
            <div className='tag'>Boost your finance management</div>
          </div>
          <h2 className='section-title text-center mt-5'>
				A more effective way to track growth
          </h2>
          <p className='section-description text-center mt-5'>
			With intuitive interfaces, real-time data insights, and robust security features, you can trust our app to keep your financial information safe while providing the tools you need to make informed decisions.
          </p>
	  	</div>
        <div className='flex justify-center mt-10'>
          <Image
            src={'/images/landing-page/product-image.png'}
            alt="Product Image"
            width={1040}
            height={666}
          />
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
