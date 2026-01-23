import { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import africaMap from '@/assets/africa-map.jpg';

const chapters = [
  {
    id: 1,
    city: 'Nairobi',
    country: 'Kenya',
    year: 2004,
    status: 'active',
    description: 'The heart of AFLEWO — where it all began',
    attendees: '10,000+',
  },
  {
    id: 2,
    city: 'Mombasa',
    country: 'Kenya',
    year: 2009,
    status: 'active',
    description: 'Coastal worship experience',
    attendees: '3,000+',
  },
  {
    id: 3,
    city: 'Nyeri',
    country: 'Kenya',
    year: 2010,
    status: 'active',
    description: 'Central highlands worship',
    attendees: '2,000+',
  },
  {
    id: 4,
    city: 'Nakuru',
    country: 'Kenya',
    year: 2013,
    status: 'active',
    description: 'Rift Valley chapter',
    attendees: '2,500+',
  },
  {
    id: 5,
    city: 'Meru',
    country: 'Kenya',
    year: 2012,
    status: 'active',
    description: 'Eastern region worship',
    attendees: '1,500+',
  },
  {
    id: 6,
    city: 'Kigali',
    country: 'Rwanda',
    year: 2011,
    status: 'active',
    description: 'Rwanda chapter — Pan-African expansion',
    attendees: '5,000+',
  },
  {
    id: 7,
    city: 'Dar es Salaam',
    country: 'Tanzania',
    year: 2010,
    status: 'active',
    description: 'Tanzania worship movement',
    attendees: '4,000+',
  },
];

export function ChaptersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]);
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
      id="chapters"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-gradient-to-b from-background via-midnight-dark to-background overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className={`inline-block text-gold font-semibold text-sm uppercase tracking-widest mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Across the Continent
          </span>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-cream mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Our
            <span className="text-gradient-gold"> Chapters</span>
          </h2>
          <p
            className={`text-cream/70 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            AFLEWO has grown from Nairobi to cities across Kenya and East Africa,
            uniting believers in worship from coast to coast.
          </p>
        </div>

        {/* Map & Chapters Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Image */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={africaMap}
                alt="AFLEWO chapters across Africa"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />

              {/* Selected Chapter Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">{selectedChapter.city}, {selectedChapter.country}</span>
                  </div>
                  <p className="text-cream/80 mb-4">{selectedChapter.description}</p>
                  <div className="flex items-center gap-6 text-cream/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Since {selectedChapter.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedChapter.attendees}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="grid gap-4">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    selectedChapter.id === chapter.id
                      ? 'bg-gold/20 border-2 border-gold'
                      : 'bg-card/50 border-2 border-transparent hover:border-gold/30'
                  }`}
                  style={{ transitionDelay: `${500 + index * 50}ms` }}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedChapter.id === chapter.id
                            ? 'bg-gold text-primary-foreground'
                            : 'bg-gold/10 text-gold'
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-cream">
                          {chapter.city}
                          <span className="text-cream/50 font-normal ml-2">{chapter.country}</span>
                        </h4>
                        <p className="text-cream/60 text-sm">{chapter.description}</p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-gold font-semibold">{chapter.attendees}</div>
                      <div className="text-cream/50 text-sm">Since {chapter.year}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Start a Chapter CTA */}
            <div className="mt-8 p-6 card-glow rounded-2xl text-center">
              <h4 className="text-xl font-serif font-bold text-cream mb-2">
                Start a Chapter in Your City
              </h4>
              <p className="text-cream/60 mb-4">
                Want to bring AFLEWO to your community? Get in touch with us.
              </p>
              <Button variant="gold">Contact Us</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
