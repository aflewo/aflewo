import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, ChevronDown, Calendar, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-worship.jpg';

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="African worship gathering at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div
            className={`mb-6 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-cream/90">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Since 2004 • Uniting Africa in Worship
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-6 transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-cream">Africa</span>
            <br />
            <span className="text-gradient-gold">Let's Worship</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl md:text-2xl text-cream/80 max-w-2xl mx-auto mb-10 font-light transition-all duration-1000 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Stirring up hope in Jesus through annual events of worship in music and prayer
            from a united front of the Church across Africa.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              <Calendar className="w-5 h-5" />
              Upcoming Events
            </Button>
            <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
              <Play className="w-5 h-5" />
              Watch Worship
            </Button>
          </div>

          {/* Next Event Banner */}
          <div
            className={`inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 glass px-6 py-4 rounded-2xl transition-all duration-1000 delay-800 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center gap-2 text-gold">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">AFLEWO 2025</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-cream/20" />
            <div className="flex items-center gap-2 text-cream/80">
              <MapPin className="w-5 h-5" />
              <span>Winners' Chapel, Nairobi</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-cream/20" />
            <span className="text-cream/60">All-Night Worship Experience</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-cream/60 hover:text-gold transition-colors duration-300"
        >
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-terracotta/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
    </section>
  );
}
