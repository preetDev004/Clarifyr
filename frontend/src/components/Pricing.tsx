import React from 'react';
import Header from './ui/landing/header';

const Pricing = () => {
  return (
    <div className="container relative mb-4 mt-8 lg:mt-12">
      <Header
        badgeContent="💰 Pricing"
        title="Choose Your Plan"
        description="Flexible plans designed to fit your needs and budget—no surprises, just straightforward value."
      />
    </div>
  );
};

export default Pricing;
