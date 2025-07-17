import * as React from 'react';

function KeyboardDoubleArrowDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
	  width={props.width ?? '24px'}
	  height={props.height ?? '24px'}
	  fill={props.fill ?? '#e3e3e3'}
	  viewBox="0 -960 960 960"
	  xmlns="http://www.w3.org/2000/svg"
	  className={props.className}
	  {...props}
    >
      <path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"/>
    </svg>
  );
}

export default KeyboardDoubleArrowDown;
