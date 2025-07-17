import React from 'react';
import { HeaderBoxProps } from './headerBox.types';

const HeaderBox = ({ pathLocation, subtitle } : HeaderBoxProps) => {
  return (
    <div className='header-box mb-6'>
      <h1 className='header-box-title'>
        {pathLocation}
      </h1>
	  <p>
        {subtitle}
	  </p>
    </div>
  );
};

export default HeaderBox;
