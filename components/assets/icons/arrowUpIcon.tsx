<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="#12B76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>;

import * as React from 'react';

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
	  width={12}
	  height={12}
	  viewBox="0 0 12 12"
	  fill={props.fill ?? 'none'}
	  xmlns="http://www.w3.org/2000/svg"
	  className={props?.className}
	  {...props}
    >
	    <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke={props?.stroke ?? '#12B76A'} strokeWidth="1.5"
		 strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export { ArrowUpIcon };
