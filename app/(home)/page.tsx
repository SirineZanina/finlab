import React from 'react';
import Header from './_nextjs/components/header/header';
import Hero from './_nextjs/components/hero/hero';
import LogoTicker from './_nextjs/components/logoTicker/logoTicker';
import ProductShowcase from './_nextjs/components/productShowcase/productShowcase';
import Pricing  from './_nextjs/components/pricing/pricing';
import Testimonials from './_nextjs/components/testimonials/testimonials';
import CallToAction from './_nextjs/components/callToAction/callToAction';

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
