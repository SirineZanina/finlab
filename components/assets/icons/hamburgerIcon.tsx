import React from 'react';

const HamburgerIcon = (props:  React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
	  viewBox="0 0 24 24"
	 fill="none"
	 xmlns="http://www.w3.org/2000/svg"
	 className={props.className}
	   {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
      <g id="SVGRepo_iconCarrier"> <path d="M4 18L20 18" stroke="#344054" strokeWidth="2" strokeLinecap="round"/>
	  <path d="M4 12L20 12" stroke="#344054" strokeWidth="2" strokeLinecap="round"/>
	   <path d="M4 6L20 6" stroke="#344054" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
};
export default HamburgerIcon;
