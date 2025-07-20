
import * as React from 'react';

function ArrowLeftIcon (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
	  width={20}
	  height={20}
	  viewBox="0 0 20 20"
	  fill={props.fill ?? 'none'}
	  xmlns="http://www.w3.org/2000/svg"
      className={props?.className}
	  {...props}
    >
	   <path d="M15.8334 9.99999H4.16675M4.16675 9.99999L10.0001 15.8333M4.16675 9.99999L10.0001 4.16666"
	   stroke="#475467" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export { ArrowLeftIcon  };
