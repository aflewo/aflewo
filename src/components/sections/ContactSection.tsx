import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <section
      id="contact"
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
            Get in Touch
          </span>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-cream mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Contact
            <span className="text-gradient-gold"> Us</span>
          </h2>
          <p
            className={`text-cream/70 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Have questions? Want to volunteer, partner, or start a chapter in your city?
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="space-y-8">
              {/* Contact Cards */}
              <div className="card-glow rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-cream mb-1">Email Us</h4>
                  <a href="mailto:info@aflewo.com" className="text-gold hover:underline">
                    info@aflewo.com
                  </a>
                  <p className="text-cream/60 text-sm mt-1">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="card-glow rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-cream mb-1">Main Office</h4>
                  <p className="text-cream/80">Nairobi, Kenya</p>
                  <p className="text-cream/60 text-sm mt-1">Originated from Daystar University</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="card-glow rounded-2xl p-6">
                <h4 className="font-semibold text-cream mb-4">Follow Us</h4>
                <div className="flex flex-wrap gap-3">
                  {['YouTube', 'Instagram', 'Facebook', 'Twitter'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="px-4 py-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors duration-300 text-sm font-medium"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>

              {/* Volunteer CTA */}
              <div className="glass rounded-2xl p-6 text-center">
                <h4 className="text-xl font-serif font-bold text-cream mb-2">
                  Want to Volunteer?
                </h4>
                <p className="text-cream/60 mb-4">
                  Join our team of worship leaders, musicians, logistics, and more.
                </p>
                <Button variant="gold">Register as Volunteer</Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <form onSubmit={handleSubmit} className="card-glow rounded-3xl p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-gold" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-cream mb-2">Message Sent!</h3>
                  <p className="text-cream/60">Thank you for reaching out. We'll be in touch soon.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-serif font-bold text-cream mb-6">Send a Message</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-cream/80 text-sm mb-2" htmlFor="name">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
                        <input
                          type="text"
                          id="name"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="w-full bg-background/50 border border-border rounded-xl py-3 pl-12 pr-4 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors duration-300"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-cream/80 text-sm mb-2" htmlFor="email">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
                        <input
                          type="email"
                          id="email"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="w-full bg-background/50 border border-border rounded-xl py-3 pl-12 pr-4 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors duration-300"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-cream/80 text-sm mb-2" htmlFor="subject">
                        Subject
                      </label>
                      <select
                        id="subject"
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold transition-colors duration-300"
                        required
                      >
                        <option value="">Select a topic</option>
                        <option value="volunteer">Volunteer Inquiry</option>
                        <option value="partnership">Partnership</option>
                        <option value="chapter">Start a Chapter</option>
                        <option value="general">General Question</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-cream/80 text-sm mb-2" htmlFor="message">
                        Your Message
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-cream/40" />
                        <textarea
                          id="message"
                          rows={4}
                          value={formState.message}
                          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                          className="w-full bg-background/50 border border-border rounded-xl py-3 pl-12 pr-4 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors duration-300 resize-none"
                          placeholder="Tell us how we can help..."
                          required
                        />
                      </div>
                    </div>

                    <Button variant="hero" size="lg" className="w-full">
                      Send Message
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
