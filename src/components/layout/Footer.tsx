import { Heart, Youtube, Instagram, Facebook, Twitter, Mail, ArrowUp } from 'lucide-react';

const footerLinks = {
  quickLinks: [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Events', href: '#events' },
    { label: 'Music & Media', href: '#music' },
  ],
  getInvolved: [
    { label: 'Volunteer', href: '#contact' },
    { label: 'Partner With Us', href: '#donate' },
    { label: 'Start a Chapter', href: '#contact' },
    { label: 'Donate', href: '#donate' },
  ],
  connect: [
    { label: 'Contact', href: '#contact' },
    { label: 'Chapters', href: '#chapters' },
    { label: 'FAQ', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Youtube, href: 'https://youtube.com/@aflewoke', label: 'YouTube' },
  { icon: Instagram, href: 'https://instagram.com/aflewoke', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/aflewo', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/AFLEWO', label: 'Twitter' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-midnight-dark border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#home" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-terracotta flex items-center justify-center shadow-gold">
                <span className="text-primary-foreground font-serif font-bold text-xl">A</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-cream">AFLEWO</span>
                <p className="text-xs text-muted-foreground -mt-1">Africa Let's Worship</p>
              </div>
            </a>
            <p className="text-cream/60 mb-6 max-w-sm">
              Uniting Africa in worship since 2004. An inter-denominational movement 
              bringing believers together through music and prayer.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-cream mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream/60 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-serif font-bold text-cream mb-4">Get Involved</h4>
            <ul className="space-y-3">
              {footerLinks.getInvolved.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream/60 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-serif font-bold text-cream mb-4">Connect</h4>
            <ul className="space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream/60 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <a
                href="mailto:info@aflewo.com"
                className="inline-flex items-center gap-2 text-gold hover:underline"
              >
                <Mail className="w-4 h-4" />
                info@aflewo.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cream/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} AFLEWO - Africa Let's Worship. All rights reserved.
            </p>
            <p className="text-cream/50 text-sm flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-terracotta" fill="currentColor" /> for the glory of God
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gold text-primary-foreground shadow-gold flex items-center justify-center hover:bg-gold-light hover:-translate-y-1 transition-all duration-300 z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
