import { useEffect, useRef, useState } from 'react';
import { Play, Headphones, Youtube, ExternalLink, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import musicImage from '@/assets/music-worship.jpg';

const worshipContent = [
  {
    id: 1,
    title: 'AFLEWO 2024 Live Worship',
    type: 'Full Session',
    duration: '3:45:00',
    thumbnail: musicImage,
    views: '45K views',
  },
  {
    id: 2,
    title: 'Night of Praise - Nairobi',
    type: 'Highlights',
    duration: '28:15',
    thumbnail: musicImage,
    views: '23K views',
  },
  {
    id: 3,
    title: 'Worship Medley 2024',
    type: 'Music Video',
    duration: '12:30',
    thumbnail: musicImage,
    views: '67K views',
  },
  {
    id: 4,
    title: 'AFLEWO Kigali Experience',
    type: 'Full Session',
    duration: '2:30:00',
    thumbnail: musicImage,
    views: '18K views',
  },
];

export function MusicSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
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
      id="music"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className={`inline-block text-gold font-semibold text-sm uppercase tracking-widest mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Experience the Sound
          </span>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-cream mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Worship
            <span className="text-gradient-gold"> & Music</span>
          </h2>
          <p
            className={`text-cream/70 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Relive the powerful moments of worship. Watch full sessions, highlights,
            and exclusive content from AFLEWO gatherings across Africa.
          </p>
        </div>

        {/* Featured Video */}
        <div
          className={`relative rounded-3xl overflow-hidden mb-12 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="aspect-video relative group cursor-pointer">
            <img
              src={musicImage}
              alt="AFLEWO worship session"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gold/90 flex items-center justify-center shadow-gold pulse-glow group-hover:scale-110 transition-transform duration-300">
                <Play className="w-10 h-10 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Video Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-semibold rounded-full mb-3">
                Featured
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-cream mb-2">
                AFLEWO 2024 - Full Worship Experience
              </h3>
              <p className="text-cream/70">4 hours of uninterrupted worship from Winners' Chapel, Nairobi</p>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {worshipContent.map((item, index) => (
            <div
              key={item.id}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <div className="aspect-video">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                
                {/* Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-gold/20 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-gold">
                    <Play className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 rounded text-cream text-xs">
                  {item.duration}
                </div>
              </div>

              <div>
                <span className="text-gold text-xs font-medium">{item.type}</span>
                <h4 className="text-cream font-medium mt-1 group-hover:text-gold transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-cream/50 text-sm mt-1">{item.views}</p>
              </div>
            </div>
          ))}
        </div>

        {/* YouTube CTA */}
        <div
          className={`text-center transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <Button variant="gold" size="lg" className="gap-3">
            <Youtube className="w-5 h-5" />
            Watch More on YouTube
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
