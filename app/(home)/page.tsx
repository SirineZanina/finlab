import React from 'react';
import Header from './components/header';
import Hero from './components/hero';
import LogoTicker from './components/logoTicker';
import ProductShowcase from './components/productShowcase';

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
