import { useEffect, useRef, useState } from 'react';
import { Heart, Users, Music, Globe, Calendar, Church } from 'lucide-react';
import communityImage from '@/assets/community-worship.jpg';

const stats = [
  { icon: Calendar, value: '20+', label: 'Years of Worship' },
  { icon: Users, value: '10,000+', label: 'Worshippers Annually' },
  { icon: Globe, value: '7+', label: 'Cities Across Africa' },
  { icon: Church, value: '100+', label: 'Partner Churches' },
];

const values = [
  {
    icon: Heart,
    title: 'Faith Rooted',
    description: 'Grounded in the Gospel of Jesus Christ, we believe in the transformative power of worship.',
  },
  {
    icon: Users,
    title: 'Unity in Diversity',
    description: 'Inter-denominational movement bringing together believers from all backgrounds.',
  },
  {
    icon: Music,
    title: 'Worship First',
    description: 'Music and prayer as our primary languages, lifting voices across the continent.',
  },
];

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-terracotta/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className={`inline-block text-gold font-semibold text-sm uppercase tracking-widest mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Our Story
          </span>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-cream mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Uniting Africa
            <br />
            <span className="text-gradient-gold">In Worship</span>
          </h2>
          <div
            className={`section-divider mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Image Side */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={communityImage}
                alt="AFLEWO community in worship"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:right-8 glass px-6 py-4 rounded-2xl shadow-card">
              <div className="text-4xl font-serif font-bold text-gold">2004</div>
              <div className="text-cream/80 text-sm">Year Founded</div>
            </div>
          </div>

          {/* Text Side */}
          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-cream mb-6">
              From Daystar University to All of Africa
            </h3>
            <p className="text-cream/70 text-lg leading-relaxed mb-6">
              AFLEWO — <span className="text-gold font-semibold">Africa Let's Worship</span> — 
              began in 2004, born from the heart of Sing Africa, a student ministry at 
              Daystar University. What started as a vision to unite believers in worship 
              has grown into a continent-wide movement.
            </p>
            <p className="text-cream/70 text-lg leading-relaxed mb-8">
              Today, AFLEWO hosts annual all-night worship gatherings across Kenya and 
              East Africa — from Nairobi to Mombasa, Kigali to Dar-es-Salaam — bringing 
              thousands together in prayer, music, and spiritual renewal.
            </p>

            {/* Mission Statement */}
            <div className="bg-card/50 border border-gold/20 rounded-2xl p-6">
              <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Our Vision
              </h4>
              <blockquote className="text-cream/90 italic font-serif text-lg">
                "To stir up hope in Jesus through annual events of worship in music 
                and prayer from a united front of the Church across Africa."
              </blockquote>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="card-glow rounded-2xl p-6 text-center"
              style={{ transitionDelay: `${700 + index * 100}ms` }}
            >
              <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-serif font-bold text-cream mb-1">
                {stat.value}
              </div>
              <div className="text-cream/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`card-glow rounded-2xl p-8 text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${900 + index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-xl font-serif font-bold text-cream mb-3">{value.title}</h4>
              <p className="text-cream/60">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
