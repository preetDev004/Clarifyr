'use client';
import { motion, useInView } from 'framer-motion';
import { Check } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/Button';
import Header from './ui/landing/header';
interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  isPopular?: boolean;
}

const Pricing = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const plans: PricingPlan[] = [
    {
      name: 'BASIC',
      price: billingCycle === 'monthly' ? '$0' : '$0',
      description: 'Perfect for trying out the platform.',
      features: [
        { text: '1 Chatbot', included: true },
        { text: '500 Messages / month', included: true },
        { text: 'Basic Analytics', included: true },
        { text: 'Standard Support', included: true },
        { text: 'Document Upload (5MB limit)', included: true },
      ],
      buttonText: 'Get Started',
    },
    {
      name: 'PLUS',
      price: billingCycle === 'monthly' ? '$29' : '$19',
      description: 'For growing businesses with moderate support needs.',
      features: [
        { text: '3 Chatbots', included: true },
        { text: '5,000 Messages / month', included: true },
        { text: 'Advanced Analytics', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Custom Appearance', included: true },
        { text: 'Document Upload (20MB limit)', included: true },
        { text: 'Multilingual Support', included: true },
      ],
      buttonText: 'Subscribe',
      isPopular: true,
    },
    {
      name: 'PRO',
      price: billingCycle === 'monthly' ? '$79' : '$59',
      description: 'For businesses with high customer support volume.',
      features: [
        { text: 'Everything in Plus', included: true },
        { text: '10 Chatbots', included: true },
        { text: '20,000 Messages / month', included: true },
        { text: 'Document Upload (50MB limit)', included: true },
        { text: 'Human Handoff', included: true },
      ],
      buttonText: 'Subscribe',
    },
  ];

  return (
    <section className="container relative mb-4 mt-8 w-full overflow-hidden p-4 lg:mt-12">
      <div className="relative z-10 mx-auto mb-5 max-w-7xl" >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-2 flex flex-col items-center sm:-mb-2"
          ref={ref}
        >
          <Header
            badgeContent="💰 Pricing"
            title="Choose Your Plan"
            description="Flexible plans designed to fit your needs and budget—no surprises, just straightforward value."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="mb-10 flex items-center justify-center"
         
        >
          <div className="rounded-full bg-muted p-1">
            <button
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                billingCycle === 'monthly'
                  ? 'shadow-subtle bg-white dark:bg-custom-darkblue'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                billingCycle === 'yearly'
                  ? 'shadow-subtle bg-white dark:bg-custom-darkblue'
                  : 'text-black dark:text-white'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly{' '}
              <span className="text-xs font-medium text-primary dark:text-custom-hoverdark sm:text-sm">
                Save 25%
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row xl:gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={
              plan.price === '$0'
                ? { opacity: 0, x: -50, y: 50 }
                : plan.isPopular
                  ? { opacity: 0, y: 50 }
                  : { opacity: 0, x: 50, y: 50 }
            }
            animate={isInView ? { opacity: 1 , x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, type: 'spring' }}
            className={`relative h-fit w-full rounded-xl ${plan.isPopular ? 'border-2 border-primary sm:scale-105' : 'border border-border md:mt-8'} bg-card p-6`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                <div className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              </div>
            )}

            <div className="mb-6 text-center">
              <h3 className="mb-2 text-xl font-semibold">{plan.name}</h3>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-bold">{plan.price}</span>

                <span className="ml-1 text-muted-foreground">/ month</span>
              </div>
              {plan.price !== '$0' && (
                <span className="ml-1 text-sm text-muted-foreground">
                  {billingCycle === 'monthly'
                    ? 'billed monthly'
                    : 'billed yearly'}
                </span>
              )}
            </div>

            <div className="mb-8 space-y-4">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <div
                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                      feature.included
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {feature.included ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="text-xs">×</span>
                    )}
                  </div>
                  <span className={`ml-2 text-sm text-foreground`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
            <Button
              className={`mb-2 w-full ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}`}
            >
              {plan.buttonText}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {plan.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
