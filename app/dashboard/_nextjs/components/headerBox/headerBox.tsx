import React from 'react';
import { HeaderBoxProps } from './headerBox.types';

const HeaderBox = ({ pathLocation } : HeaderBoxProps) => {
  return (
    <div className='header-box'>
      <h1 className='header-box-title'>
        {pathLocation}
      </h1>
    </div>
  );
};

export default HeaderBox;
