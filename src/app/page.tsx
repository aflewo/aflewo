"use client";

import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ChaptersSection from "@/components/sections/ChaptersSection";
import EventHub from "@/components/sections/EventHub";
import MediaPreview from "@/components/sections/MediaPreview";
import StoriesTeaser from "@/components/sections/StoriesTeaser";
import JoinCTA from "@/components/sections/JoinCTA";
import PartnersSection from "@/components/sections/PartnersSection";
import LeadershipSection from "@/components/sections/LeadershipSection";
import { useEffect } from "react";
import gsap from "gsap";

export default function Home() {
  useEffect(() => {
    // Global reveal on mount
    gsap.to("main", { opacity: 1, duration: 1, ease: "expo.out" });
  }, []);

  return (
    <main className="relative bg-background opacity-0">
      <HeroSection />

      <div className="relative z-10 bg-background">
        <AboutSection />
        <ChaptersSection />
        <EventHub />
        <MediaPreview />
        <StoriesTeaser />
        <PartnersSection />
        <LeadershipSection />
        <JoinCTA />
      </div>
    </main>
  );
}
