import { useEffect, useRef, useState } from 'react';
import { Heart, CreditCard, Phone, Building2, Gift, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const donationTiers = [
  {
    amount: 'KES 500',
    title: 'Friend',
    description: "Support a worshipper's transport",
    icon: Heart,
  },
  {
    amount: 'KES 2,000',
    title: 'Partner',
    description: 'Sponsor equipment for one night',
    icon: Gift,
  },
  {
    amount: 'KES 10,000',
    title: 'Champion',
    description: 'Fund a chapter event',
    icon: Building2,
    featured: true,
  },
];

const paymentMethods = [
  {
    name: 'M-Pesa',
    icon: Phone,
    details: 'Till Number: 819867',
    description: 'AFLEWO Kenya',
  },
  {
    name: 'Bank Transfer',
    icon: Building2,
    details: 'NCBA Bank',
    description: 'A/C: 1234567890',
  },
];

const impactStats = [
  { value: '100%', label: 'Goes to ministry' },
  { value: 'Free', label: 'Events for all' },
  { value: '20+', label: 'Years of impact' },
];

export function DonateSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="donate"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-terracotta/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-terracotta/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className={`inline-block text-gold font-semibold text-sm uppercase tracking-widest mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Support the Movement
          </span>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-cream mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Partner With
            <span className="text-gradient-gold"> AFLEWO</span>
          </h2>
          <p
            className={`text-cream/70 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            AFLEWO events are free for all attendees. Your generous support helps us 
            bring worship experiences to thousands across Africa.
          </p>
        </div>

        {/* Impact Stats */}
        <div
          className={`flex flex-wrap justify-center gap-8 md:gap-16 mb-16 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {impactStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-serif font-bold text-gold">{stat.value}</div>
              <div className="text-cream/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Donation Tiers */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {donationTiers.map((tier, index) => (
            <div
              key={tier.title}
              className={`relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              } ${tier.featured ? 'md:-mt-4 md:mb-4' : ''}`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div
                className={`h-full rounded-3xl p-8 text-center ${
                  tier.featured
                    ? 'bg-gradient-to-br from-gold/20 to-terracotta/20 border-2 border-gold'
                    : 'card-glow'
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-primary-foreground text-xs font-bold rounded-full">
                    Most Popular
                  </span>
                )}

                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    tier.featured ? 'bg-gold text-primary-foreground' : 'bg-gold/10 text-gold'
                  }`}
                >
                  <tier.icon className="w-8 h-8" />
                </div>

                <div className="text-3xl font-serif font-bold text-cream mb-2">{tier.amount}</div>
                <h3 className="text-xl font-semibold text-gold mb-3">{tier.title}</h3>
                <p className="text-cream/60 mb-6">{tier.description}</p>

                <Button
                  variant={tier.featured ? 'hero' : 'gold'}
                  className="w-full"
                >
                  Donate
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div
          className={`max-w-2xl mx-auto transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <h3 className="text-2xl font-serif font-bold text-cream text-center mb-8">
            How to Give
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="card-glow rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <method.icon className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-cream">{method.name}</h4>
                  <p className="text-gold font-medium">{method.details}</p>
                  <p className="text-cream/60 text-sm">{method.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Note */}
          <div className="mt-8 p-6 glass rounded-2xl text-center">
            <p className="text-cream/80">
              <span className="text-gold font-semibold">Corporate Partnerships:</span> For 
              sponsorship opportunities and corporate giving, please contact us at{' '}
              <a href="mailto:info@aflewo.com" className="text-gold hover:underline">
                info@aflewo.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
