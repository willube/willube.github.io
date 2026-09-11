"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { TechFocus } from "@/components/TechFocus";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackgroundMesh } from "@/components/BackgroundMesh";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#191919] text-[#FBF9F6] overflow-x-hidden selection:bg-[#E05A47]/30 selection:text-[#FBF9F6]">
      {/* Editorial Architectural Background Grid */}
      <BackgroundMesh />

      {/* Structured Navigation Bar */}
      <Navbar />

      {/* Hero Section with Editorial Lora & JetBrains Mono Command Bar */}
      <Hero />

      {/* DeadSense Text Editor Window & Architecture */}
      <Projects />

      {/* Capabilities Matrix Grid */}
      <TechFocus />

      {/* Direct Reach & Message Composer */}
      <Contact />

      {/* IDE Status Bar Footer */}
      <Footer />
    </main>
  );
}
