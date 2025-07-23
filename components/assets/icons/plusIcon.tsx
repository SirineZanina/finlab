
import * as React from 'react';

function PlusIcon (props: React.SVGProps<SVGSVGElement>) {
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
	    <path d="M9.99984 4.16666V15.8333M4.1665 10H15.8332"
		 stroke="#475467" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export { PlusIcon };

