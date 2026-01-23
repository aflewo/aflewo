import { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import eventImage from '@/assets/event-night.jpg';

const upcomingEvents = [
  {
    id: 1,
    title: 'AFLEWO Nairobi 2025',
    date: 'April 2025',
    time: '6:00 PM - Dawn',
    venue: "Winners' Chapel International",
    location: 'Likoni Road, Nairobi',
    featured: true,
    attendees: '10,000+',
  },
  {
    id: 2,
    title: 'AFLEWO Mombasa',
    date: 'June 2025',
    time: '6:00 PM - Dawn',
    venue: 'JCC Bamburi Centre',
    location: 'Bamburi, Mombasa',
    featured: false,
    attendees: '3,000+',
  },
  {
    id: 3,
    title: 'AFLEWO Kigali',
    date: 'August 2025',
    time: '6:00 PM - Dawn',
    venue: 'Christian Life Assembly',
    location: 'Kigali, Rwanda',
    featured: false,
    attendees: '5,000+',
  },
];

const pastHighlights = [
  { year: '2024', title: 'AFLEWO Nairobi', highlight: 'Record attendance of 12,000+ worshippers' },
  { year: '2023', title: 'AFLEWO Tanzania', highlight: 'First virtual + in-person hybrid event' },
  { year: '2022', title: 'Return to Live', highlight: 'Post-pandemic revival gatherings' },
];

export function EventsSection() {
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
      id="events"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-gradient-to-b from-midnight-dark via-midnight to-background overflow-hidden"
    >
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-10">
        <img
          src={eventImage}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className={`inline-block text-gold font-semibold text-sm uppercase tracking-widest mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Join the Movement
          </span>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-cream mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Upcoming
            <span className="text-gradient-gold"> Events</span>
          </h2>
          <p
            className={`text-cream/70 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            All-night worship experiences across Africa. Free entry, open to all believers.
            Join thousands in unified praise and prayer.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {upcomingEvents.map((event, index) => (
            <div
              key={event.id}
              className={`relative group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              } ${event.featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div
                className={`h-full card-glow rounded-3xl overflow-hidden ${
                  event.featured ? 'p-8 md:p-10' : 'p-6'
                }`}
              >
                {event.featured && (
                  <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-semibold rounded-full mb-4">
                    Featured Event
                  </span>
                )}

                <h3
                  className={`font-serif font-bold text-cream mb-4 ${
                    event.featured ? 'text-3xl md:text-4xl' : 'text-2xl'
                  }`}
                >
                  {event.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-cream/70">
                    <Calendar className="w-5 h-5 text-gold" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-cream/70">
                    <Clock className="w-5 h-5 text-gold" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-cream/70">
                    <MapPin className="w-5 h-5 text-gold" />
                    <div>
                      <div>{event.venue}</div>
                      <div className="text-sm text-cream/50">{event.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-cream/70">
                    <Users className="w-5 h-5 text-gold" />
                    <span>Expected: {event.attendees} worshippers</span>
                  </div>
                </div>

                <div className={`flex gap-4 ${event.featured ? 'flex-col sm:flex-row' : 'flex-col'}`}>
                  <Button variant="gold" className={event.featured ? 'flex-1' : 'w-full'}>
                    Register Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className={event.featured ? 'flex-1' : 'w-full'}>
                    Learn More
                  </Button>
                </div>

                {/* Decorative glow for featured */}
                {event.featured && (
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/10 rounded-full blur-3xl" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Past Highlights */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <h3 className="text-2xl font-serif font-bold text-cream text-center mb-8">
            Past Highlights
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {pastHighlights.map((item) => (
              <div
                key={item.year}
                className="glass rounded-xl px-6 py-4 flex items-center gap-4"
              >
                <span className="text-2xl font-serif font-bold text-gold">{item.year}</span>
                <div className="w-px h-8 bg-cream/20" />
                <div>
                  <div className="text-cream font-medium">{item.title}</div>
                  <div className="text-cream/60 text-sm">{item.highlight}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
