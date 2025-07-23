import React from 'react';
import Image from 'next/image';

const LogoTicker = () => {
  return (
    <div className='py-8 md:py-12 bg-white'>
	 <div className='container'>
        <div className='flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]'>
		 <div className='flex gap-14 flex-none'>
            <Image src={'/images/landing-page/logos/logo-acme.png'} alt='Acme Logo' className='logo-ticker-image' width={238} height={52} />
            <Image src={'/images/landing-page/logos/logo-quantum.png'} alt='Quantum Logo' className='logo-ticker-image' width={204} height={52} />
            <Image src={'/images/landing-page/logos/logo-echo.png'} alt='Echo Logo' className='logo-ticker-image' width={238} height={44} />
            <Image src={'/images/landing-page/logos/logo-celestial.png'} alt='Celestial Logo' className='logo-ticker-image' width={188} height={48} />
            <Image src={'/images/landing-page/logos/logo-pulse.png'} alt='Pulse Logo' className='logo-ticker-image' width={164} height={38} />
            <Image src={'/images/landing-page/logos/logo-apex.png'} alt='Apex Logo' className='logo-ticker-image' width={151} height={49} />
            <Image src={'/images/landing-page/logos/logo-acme.png'} alt='Acme Logo' className='logo-ticker-image' width={238} height={52} />
          </div>
	 </div>
      </div>
    </div>
  );
};

export default LogoTicker;
