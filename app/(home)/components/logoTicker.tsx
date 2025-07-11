import Image from 'next/image';
import React from 'react';

const LogoTicker = () => {
  return (
    <div className='py-8 md:py-12 bg-white'>
	 <div className='container'>
        <div className='flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]'>
		 <div className='flex gap-14 flex-none'>
            <Image src={'/logo/logo-acme.png'} alt='Acme Logo' className='logo-ticker-image' width={238} height={52} />
            <Image src={'/logo/logo-quantum.png'} alt='Quantum Logo' className='logo-ticker-image' width={204} height={52} />
            <Image src={'/logo/logo-echo.png'} alt='Echo Logo' className='logo-ticker-image' width={238} height={44} />
            <Image src={'/logo/logo-celestial.png'} alt='Celestial Logo' className='logo-ticker-image' width={188} height={48} />
            <Image src={'/logo/logo-pulse.png'} alt='Pulse Logo' className='logo-ticker-image' width={164} height={38} />
            <Image src={'/logo/logo-apex.png'} alt='Apex Logo' className='logo-ticker-image' width={151} height={49} />
			            <Image src={'/logo/logo-acme.png'} alt='Acme Logo' className='logo-ticker-image' width={238} height={52} />

          </div>

	 </div>
      </div>
    </div>
  );
};

export default LogoTicker;
