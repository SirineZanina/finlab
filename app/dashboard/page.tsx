import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Home = () => {

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-4xl mb-8'>Dashboard: </h1>
	  <div className='flex gap-2'>

        <Button asChild>
          <Link href='/'>Home</Link>
        </Button>
	  </div>

    </div>
  );
};

export default Home;
