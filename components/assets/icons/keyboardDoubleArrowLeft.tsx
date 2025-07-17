import * as React from 'react';

function KeyboardDoubleArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
	  width="24px"
	  height="24px"
	  viewBox="0 -960 960 960"
	  xmlns="http://www.w3.org/2000/svg"
	  className={props.className}
	  fill={props.fill ?? '#e3e3e3'}
	  {...props}
    >
      <path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z"/>
    </svg>
  );
}

export default KeyboardDoubleArrowLeft;
