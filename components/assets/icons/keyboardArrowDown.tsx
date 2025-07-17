import * as React from 'react';

function KeyboardArrowDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width ?? '24px'}
	  height={props.height ?? '24px'}
	  viewBox="0 -960 960 960"
	  xmlns="http://www.w3.org/2000/svg"
	  className={props.className}
	  fill={props.fill ?? '#e3e3e3'}
	  {...props}

    >
      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
    </svg>
  );
}

export default KeyboardArrowDown;
