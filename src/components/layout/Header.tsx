import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Music', href: '#music' },
  { label: 'Chapters', href: '#chapters' },
  { label: 'Donate', href: '#donate' },
  { label: 'Contact', href: '#contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-card py-3'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-terracotta flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300">
            <span className="text-primary-foreground font-serif font-bold text-xl">A</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-2xl font-serif font-bold text-cream">AFLEWO</span>
            <p className="text-xs text-muted-foreground -mt-1">Africa Let's Worship</p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-cream/80 hover:text-gold font-medium transition-colors duration-300 link-underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="heroOutline" size="sm">
            Join Us
          </Button>
          <Button variant="hero" size="sm">
            Donate Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-cream p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden fixed inset-x-0 top-[72px] bg-background/98 backdrop-blur-xl border-b border-border transition-all duration-500 overflow-hidden',
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="text-cream/80 hover:text-gold font-medium py-3 border-b border-border/50 transition-colors duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <Button variant="heroOutline" className="w-full">
              Join Us
            </Button>
            <Button variant="hero" className="w-full">
              Donate Now
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
