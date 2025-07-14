import React from 'react';
import Header from './components/header/header';
import Hero from './components/hero/hero';
import LogoTicker from './components/logoTicker/logoTicker';
import ProductShowcase from './components/productShowcase/productShowcase';
import Pricing  from './components/pricing/pricing';
import Testimonials from './components/testimonials/testimonials';
import CallToAction from './components/callToAction/callToAction';

const Home = () => {
  return (
    <main>
      <Header />
	  <Hero />
	  <LogoTicker />
	  <ProductShowcase />
	  <Pricing />
	  <Testimonials />
	  <CallToAction />
    </main>
  );
};

export default Home;
