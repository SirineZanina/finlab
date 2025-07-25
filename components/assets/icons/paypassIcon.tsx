
import * as React from 'react';

function PaypassIcon (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
	  width={20}
	  height={24}
	  viewBox="0 0 20 24"
	  fill={props.fill ?? 'none'}
	  xmlns="http://www.w3.org/2000/svg"
	  className={props?.className}
	  {...props}
    >
      <g clipPath="url(#clip0_3316_34535)">
        <path d="M15.143 1.28572C17.0237 4.54328 18.0139 8.23851 18.0139 12C18.0139 15.7615 17.0237
		19.4567 15.143 22.7143M10.4287 3.64286C11.8957 6.18376 12.668 9.06604 12.668
		12C12.668 14.934 11.8957 17.8163 10.4287 20.3571M5.92871 5.80715C6.98945
		7.66396 7.54789 9.77024 7.54789 11.9143C7.54789 14.0583 6.98945 16.1646
		5.92871 18.0214M1.42871 8.14286C2.19318 9.29984 2.59847 10.6362 2.59847
		12C2.59847 13.3638 2.19318 14.7002 1.42871 15.8571"
        stroke="white" strokeWidth="2.57143" strokeLinecap="round"/>
      </g>
      <defs>
        <clipPath id="clip0_3316_34535">
          <rect width="20" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export { PaypassIcon  };
