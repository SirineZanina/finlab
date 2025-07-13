import React from 'react';
import { pricingTiers } from './pricing.constants';
import { CheckIcon } from '@/components/assets/icons/checkIcon';
import { Button } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';

const Pricing = () => {
  return (
    <section className='py-24'>
      <div className='container'>
        <div className='section-heading'>
          <h2 className='section-title text-center'>Pricing</h2>
          <p className='section-description text-center mt-5'>
			Free forever. Upgrade for unlimited tasks, better security, and exclusive features.
          </p>
        </div>
      </div>
	  <div className='flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center'>
        {pricingTiers.map((tier) => (
          <div key={tier.id} className={twMerge(
            'p-10 border border-[#F1F1F1] rounded-3xl shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full',
		   tier.inverse === true && 'border-black bg-black text-white')}>
            <div className='flex justify-between'>
				 <h3 className={twMerge(
                	'text-large font-bold text-dark-blue/50',
					 tier.inverse === true && 'text-white/60' )}>
                {tier.title}
              </h3>
              {tier.popular === true && (
					 <div className='inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20'>
				 	<span className='bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)]
					text-transparent bg-clip-text font-medium'>
						Popular
                  </span>
				 </div>
              )
              }
            </div>
            <p className='flex items-baseline gap-1 mt-[30px]'>
              <span className='text-4xl font-bold tracking-tighter leading-none'>${tier.monthlyPrice}</span>
              <span className='tracking-tight font-bold'>/month</span>
            </p>
            <Button variant={'default'} className={twMerge(
              'w-full mt-[30px]',
				 tier.inverse === true && 'bg-white text-black')}>
			  {tier.buttonText}
            </Button>
            <ul className='flex flex-col gap-5 mt-8'>
              {tier.features.map((feature, index) => (
                <li key={index} className='text-sm flex items-center gap-4'>
                  <span className="flex items-center gap-2 ">
                    <CheckIcon className='h-6 w-6' />
                    {feature}
				  </span>
                </li>
              ))}
            </ul>

		  </div>

        ))}

	  </div>

    </section>
  );
};

export default Pricing;

