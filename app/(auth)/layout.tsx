import CompanyLogo from '@/components/shared/companyLogo/companyLogo';
import Image from 'next/image';
import React from 'react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({
  children
}: OnboardingLayoutProps) {
  return (
    <div className='grid lg:grid-cols-2 grid-cols-1 h-screen'>
      {/* Left side - Image section */}
      <div className='relative col-span-1 flex items-center justify-center overflow-hidden h-full'>
        {/* Background Image */}
        <Image
          src='/images/onboarding-bg.jpg'
          alt='Background'
          fill
		  sizes='(max-width: 1024px) 100vw, 50vw'
		  quality={100}
          className='object-cover scale-105 -z-20'
          priority
        />

        {/* Strong Dark Overlay for better text visibility */}
        <div className='absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent -z-10'></div>

        {/* Content with backdrop */}
        <div className='flex flex-col items-start max-w-sm relative z-10 text-white px-8 py-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10'>
          <div className='mb-8 drop-shadow-2xl'>
            <CompanyLogo fillLogo='#FFFF' />
          </div>

          <div className='space-y-4'>
            <h1 className='text-2xl lg:text-3xl font-bold leading-tight drop-shadow-2xl text-shadow-lg'>
              Finance tracking made easy.
            </h1>
            <p className='text-lg text-white leading-relaxed drop-shadow-lg font-medium'>
              Join us to manage your finances effortlessly and take control of your financial future.
            </p>
          </div>

          {/* Optional decorative element */}
          <div className='mt-6 w-16 h-1 bg-white/80 rounded-full shadow-lg'></div>
        </div>
      </div>

      {/* Content section - Right side on desktop */}
      <div className='col-span-1 flex items-center justify-center p-8 lg:p-20 bg-white min-h-screen'>
        <div className='w-full max-w-md space-y-6'>
          {children}
        </div>
      </div>
    </div>
  );
}
