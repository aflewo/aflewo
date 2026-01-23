import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { MusicSection } from '@/components/sections/MusicSection';
import { ChaptersSection } from '@/components/sections/ChaptersSection';
import { DonateSection } from '@/components/sections/DonateSection';
import { ContactSection } from '@/components/sections/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <EventsSection />
        <MusicSection />
        <ChaptersSection />
        <DonateSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;