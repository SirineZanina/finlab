import React from 'react';
import Header from './_components/header';
import Hero from './_components/hero';
import LogoTicker from './_components/logoTicker';
import ProductShowcase from './_components/productShowcase';
import Pricing  from './_components/pricing/pricing';
import Testimonials from './_components/testimonials/testimonials';
import CallToAction from './_components/callToAction';

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
