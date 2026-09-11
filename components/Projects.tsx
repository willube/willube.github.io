"use client";

import React from "react";
import {
  ArrowUpRight,
  Terminal,
  Globe,
  Database,
  Shield,
  Layers,
  Cpu,
} from "lucide-react";

export const Projects: React.FC = () => {
  return (
    <section id="deadsense" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#212121] border border-[#3E3E3E] text-[#A09D98] text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05A47]" />
          <span>FLAGSHIP PROJECT // FOUNDER &amp; LEAD DEV</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FBF9F6] mb-4">
          DeadSense
        </h2>

        <p className="max-w-xl text-[#A09D98] text-sm sm:text-base font-sans leading-relaxed">
          A software platform and utility suite for Deadlock, combining a high-performance native desktop client, full-stack Next.js web application, and cloud database.
        </p>
      </div>

      {/* Clean Editorial Showcase Card */}
      <div className="border border-[#3E3E3E] bg-[#1E1E1E] rounded-sm overflow-hidden mb-14">
        {/* Card Header Bar */}
        <div className="px-4 py-3 bg-[#242424] border-b border-[#3E3E3E] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 text-[#A09D98]">
            <span className="w-2 h-2 rounded-full bg-[#3E3E3E]" />
            <span className="w-2 h-2 rounded-full bg-[#3E3E3E]" />
            <span className="w-2 h-2 rounded-full bg-[#3E3E3E]" />
            <span className="ml-2 text-[#FBF9F6]">deadsense.cc</span>
            <span className="text-[#3E3E3E]">/</span>
            <span className="text-[#A09D98]">production</span>
          </div>

          <a
            href="https://deadsense.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#212121] hover:bg-[#282828] border border-[#3E3E3E] text-xs font-mono text-[#FBF9F6] hover:border-[#E05A47] transition-colors"
          >
            <span>Visit deadsense.cc</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Card Content */}
        <div className="p-6 sm:p-8">
          <div className="max-w-3xl mb-8">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FBF9F6] mb-3">
              DeadSense Platform &amp; Software Suite
            </h3>
            <p className="text-sm text-[#A09D98] font-sans leading-relaxed">
              Designed and built from the ground up as a complete software ecosystem. DeadSense pairs a lightweight native C++ desktop client with a modern web portal deployed on Vercel, shielded by Cloudflare, with Discord OAuth2 single sign-on and Supabase real-time database infrastructure.
            </p>
          </div>

          {/* 3 Minimal Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 border border-[#3E3E3E] bg-[#222222]">
              <div className="text-[#E05A47] font-mono text-xs font-semibold uppercase mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Native Desktop Client</span>
              </div>
              <p className="text-xs text-[#A09D98] font-sans leading-relaxed">
                Engineered in modern C++ for low CPU utilization, minimal footprint, and stable native execution.
              </p>
            </div>

            <div className="p-4 border border-[#3E3E3E] bg-[#222222]">
              <div className="text-[#E05A47] font-mono text-xs font-semibold uppercase mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Vercel &amp; Cloudflare Edge</span>
              </div>
              <p className="text-xs text-[#A09D98] font-sans leading-relaxed">
                Deployed globally on Vercel with Cloudflare edge caching, SSL, and robust DDoS mitigation.
              </p>
            </div>

            <div className="p-4 border border-[#3E3E3E] bg-[#222222]">
              <div className="text-[#E05A47] font-mono text-xs font-semibold uppercase mb-1.5 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Cloud Infrastructure</span>
              </div>
              <p className="text-xs text-[#A09D98] font-sans leading-relaxed">
                Supabase PostgreSQL backend utilizing Row Level Security for secure user accounts and license management.
              </p>
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="pt-4 border-t border-[#3E3E3E]/60 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[#A09D98]">
            <div className="flex items-center gap-2">
              <span>Stack:</span>
              <div className="flex flex-wrap gap-1.5">
                {["C++", "Next.js", "React", "TypeScript", "Vercel", "Cloudflare", "Supabase", "Discord API"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 bg-[#252525] border border-[#3E3E3E] text-[#FBF9F6]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-[#A09D98]">Live at deadsense.cc</span>
          </div>
        </div>
      </div>

      {/* System Architecture Section */}
      <div id="architecture" className="pt-2">
        <div className="text-center mb-10">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FBF9F6] tracking-tight mb-2">
            System Architecture
          </h3>
          <p className="text-xs sm:text-sm text-[#A09D98] max-w-md mx-auto font-sans">
            How the web platform, cloud database, and desktop client connect.
          </p>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#3E3E3E] bg-[#1E1E1E]">
          {/* Tier 1 */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#3E3E3E]">
            <div className="font-mono text-[11px] text-[#E05A47] mb-1">01 // WEB &amp; EDGE TIER</div>
            <h4 className="font-serif font-bold text-base text-[#FBF9F6] mb-3">
              Vercel &amp; Cloudflare
            </h4>
            <ul className="space-y-2 text-xs text-[#A09D98] font-mono">
              <li className="flex items-start gap-2">
                <span className="text-[#E05A47]">▹</span>
                <span className="font-sans">Global Next.js deployment powered by Vercel edge network</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E05A47]">▹</span>
                <span className="font-sans">Cloudflare DNS, SSL/TLS, edge caching &amp; DDoS protection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E05A47]">▹</span>
                <span className="font-sans">Discord OAuth2 SSO user authentication &amp; portal controls</span>
              </li>
            </ul>
          </div>

          {/* Tier 2 */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#3E3E3E]">
            <div className="font-mono text-[11px] text-[#E05A47] mb-1">02 // DATA TIER</div>
            <h4 className="font-serif font-bold text-base text-[#FBF9F6] mb-3">
              Cloud Database
            </h4>
            <ul className="space-y-2 text-xs text-[#A09D98] font-mono">
              <li className="flex items-start gap-2">
                <span className="text-[#E05A47]">▹</span>
                <span className="font-sans">PostgreSQL storage with Row Level Security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E05A47]">▹</span>
                <span className="font-sans">Automated session validation &amp; access control</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E05A47]">▹</span>
                <span className="font-sans">Real-time telemetry and subscription syncing</span>
              </li>
            </ul>
          </div>

          {/* Tier 3 */}
          <div className="p-6">
            <div className="font-mono text-[11px] text-[#E05A47] mb-1">03 // CLIENT TIER</div>
            <h4 className="font-serif font-bold text-base text-[#FBF9F6] mb-3">
              Native Client
            </h4>
            <ul className="space-y-2 text-xs text-[#A09D98] font-mono">
              <li className="flex items-start gap-2">
                <span className="text-[#E05A47]">▹</span>
                <span className="font-sans">Native C++ desktop executable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E05A47]">▹</span>
                <span className="font-sans">Direct Win32 optimization with low overhead</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E05A47]">▹</span>
                <span className="font-sans">Secure session handshake with cloud services</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
