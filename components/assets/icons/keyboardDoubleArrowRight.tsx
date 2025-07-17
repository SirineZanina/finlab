import * as React from 'react';

function KeyboardDoubleArrowRight(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z"/>
    </svg>
  );
}

export default KeyboardDoubleArrowRight;
