import React from 'react';

const IconChevronRight = (props:  React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24"
      fill={props.fill ?? 'none'}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      {...props}
    >
      <path
        stroke={props.stroke ?? 'currentColor'}
        fill={props.fill ?? 'none'}
        strokeWidth={props.strokeWidth ?? '2'}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 18l6-6-6-6"
      ></path>
    </svg>
  );
};
export default IconChevronRight;
