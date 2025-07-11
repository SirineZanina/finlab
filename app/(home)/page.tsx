import React from 'react';
import Header from './_nextjs/components/header';
import Hero from './_nextjs/components/hero';
import LogoTicker from './_nextjs/components/logoTicker';
import ProductShowcase from './_nextjs/components/productShowcase';

const Home = () => {
  return (
    <main>
      <Header />
	  <Hero />
	  <LogoTicker />
	  <ProductShowcase />
    </main>
  );
};

export default Home;
