"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[75vh] flex flex-col justify-center items-center px-4 pt-28 pb-16 overflow-hidden">
      {/* Editorial Status Tag */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#212121] border border-[#3E3E3E] mb-8 font-mono text-xs"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#E05A47]" />
        <span className="text-[#A09D98]">SYS: ACTIVE</span>
        <span className="text-[#3E3E3E]">|</span>
        <span className="text-[#FBF9F6]">Founder &amp; Lead Dev // DeadSense</span>
      </motion.div>

      {/* Main Editorial Serif Headline */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-3xl text-center"
      >
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#FBF9F6] mb-3">
          Aury
        </h1>

        <h2 className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#A09D98] font-normal mb-6">
          Founder &amp; Lead Developer of DeadSense
        </h2>

        {/* Short Bio */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#A09D98] font-sans leading-relaxed mb-8 text-balance">
          Systems and full-stack developer. Creator of{" "}
          <a
            href="https://deadsense.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FBF9F6] underline decoration-[#3E3E3E] hover:decoration-[#E05A47] underline-offset-4 transition-colors"
          >
            DeadSense
          </a>{" "}
          (deadsense.cc) — a software platform and utility suite for Deadlock, combining high-performance native desktop software, Discord SSO authentication, Vercel edge deployment, and Cloudflare infrastructure.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-mono text-xs">
          <a
            href="https://deadsense.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-[#E05A47] hover:bg-[#C84A38] text-[#FBF9F6] font-semibold transition-colors"
          >
            <span>VISIT DEADSENSE.CC</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <a
            href="#deadsense"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-[#212121] border border-[#3E3E3E] text-[#FBF9F6] hover:border-[#5A5A5A] transition-colors"
          >
            <span>OVERVIEW</span>
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-[#212121] border border-[#3E3E3E] text-[#A09D98] hover:text-[#FBF9F6] hover:border-[#5A5A5A] transition-colors"
          >
            <span>CONTACT</span>
          </a>
        </div>
      </motion.div>

      {/* Structured 4-Column Technical Specification Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-14 sm:mt-18 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border border-[#3E3E3E] bg-[#1E1E1E]"
      >
        <div className="p-4 border-b sm:border-b-0 sm:border-r border-[#3E3E3E] text-left">
          <div className="font-mono text-[11px] text-[#E05A47] mb-1">01 // SYSTEMS</div>
          <div className="font-serif font-bold text-sm text-[#FBF9F6] mb-1">Native C++</div>
          <p className="font-mono text-[11px] text-[#A09D98] leading-tight">
            High-performance native desktop client architecture.
          </p>
        </div>

        <div className="p-4 border-b sm:border-b-0 md:border-r border-[#3E3E3E] text-left">
          <div className="font-mono text-[11px] text-[#E05A47] mb-1">02 // WEB &amp; EDGE</div>
          <div className="font-serif font-bold text-sm text-[#FBF9F6] mb-1">Next.js &amp; Vercel</div>
          <p className="font-mono text-[11px] text-[#A09D98] leading-tight">
            Cloudflare edge CDN &amp; Vercel deployment at deadsense.cc.
          </p>
        </div>

        <div className="p-4 border-b sm:border-b-0 sm:border-r border-[#3E3E3E] text-left">
          <div className="font-mono text-[11px] text-[#E05A47] mb-1">03 // DATABASE</div>
          <div className="font-serif font-bold text-sm text-[#FBF9F6] mb-1">Supabase Edge</div>
          <p className="font-mono text-[11px] text-[#A09D98] leading-tight">
            PostgreSQL data layer with Row Level Security.
          </p>
        </div>

        <div className="p-4 text-left">
          <div className="font-mono text-[11px] text-[#E05A47] mb-1">04 // AUTH &amp; SSO</div>
          <div className="font-serif font-bold text-sm text-[#FBF9F6] mb-1">Discord OAuth2</div>
          <p className="font-mono text-[11px] text-[#A09D98] leading-tight">
            Automated role validation &amp; account management.
          </p>
        </div>
      </motion.div>
    </section>
  );
};
