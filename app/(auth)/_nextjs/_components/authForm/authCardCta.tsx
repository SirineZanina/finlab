import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

export const AuthCardCta = () => (
  <Card className="relative flex items-start justify-center p-8 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#AFF7D5,#EFFFFC_66%)] rounded-2xl overflow-hidden">
    <div className="absolute inset-0 -right-10 z-0">
      <div className="relative w-full h-full">
        <Image
          src="/images/credit-card-img.png"
          alt="Card illustration"
          className="object-contain translate-x-1/4"
          priority
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
    <div className="relative flex flex-col justify-center gap-4">
      <h2 className="text-3xl font-bold text-primary-900">
          Reach financial <br /> goals faster
      </h2>
      <p className="text-base text-secondary-400 font-medium max-w-[250px]">
          Use your Venus card around the world with no hidden fees. Hold,
          transfer and spend money.
      </p>
      <Button size="sm" className="w-fit rounded-full">
          Learn more
      </Button>
    </div>
  </Card>
);

export default AuthCardCta;
