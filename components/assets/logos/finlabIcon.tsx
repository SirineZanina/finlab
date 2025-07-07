import * as React from 'react';

export function FinlabIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width ?? '20'}
      height={props.height ?? '20'}
      viewBox="0 0 20 20"
      fill={props.fill ?? 'none'}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      {...props}
    >
      <path d="M9.99997 0.0231453C12.3725 0.0176312 14.553 0.840183 16.2707 2.21658L9.93577 2.23131C8.88807 2.23382 8.31796 2.8036 8.32038 3.84542L8.35213 17.5085C8.35459 18.5501 8.92726 19.1173 9.92716 19.1152C10.9035 19.1129 11.4024 18.5432 11.4 17.5014L11.3867 11.7709L17.7695 11.7561C18.5552 11.7542 19.0067 11.3031 19.0049 10.5218C19.0031 9.76414 18.5496 9.3393 17.7638 9.34106L11.381 9.3559L11.3701 4.64302L18.2529 4.62702C18.3158 4.62688 18.3762 4.62332 18.4345 4.61781C19.4343 6.17038 20.0185 8.01617 20.0232 9.99988C20.036 15.5228 15.5694 20.0103 10.0465 20.0231C4.52361 20.0359 0.0360774 15.5692 0.0232414 10.0464C0.0104819 4.52356 4.47717 0.0360574 9.99997 0.0231453Z" fill="url(#paint0_linear_70_91)"/>
      <defs>
        <linearGradient id="paint0_linear_70_91" x1="7.6065" y1="3.00166" x2="12.5938" y2="21.2085" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2AAC95"/>
          <stop offset="0.989583" stopColor="#76D1F7"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
