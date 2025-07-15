import React from 'react';
import { HeaderBoxProps } from './headerBox.types';

const HeaderBox = ({ type = 'title', title, loggedInUser, subtext } : HeaderBoxProps) => {
  return (
    <div className='header-box'>
      <h1 className='header-box-title'>
        {title}
        {type === 'greeting' && loggedInUser && (
		  <span className='text-primary-600'>&nbsp;{loggedInUser.firstName}</span>
        )}
      </h1>
    </div>
  );
};

export default HeaderBox;
