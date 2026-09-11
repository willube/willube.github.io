"use client";

import React from "react";
import {
  Cpu,
  Code2,
  Lock,
  Check,
  Terminal,
  Layers,
  Database,
} from "lucide-react";

interface FocusSection {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  items: { name: string; tag?: string }[];
  description: string;
  highlights: string[];
}

const FOCUS_AREAS: FocusSection[] = [
  {
    id: "systems",
    code: "SYS // 01",
    title: "Systems & Native Engineering",
    subtitle: "Modern C++ & Low-Level",
    icon: Cpu,
    items: [
      { name: "C++", tag: "C++20" },
      { name: "Win32 API", tag: "System APIs" },
      { name: "Memory Management", tag: "Zero Overhead" },
      { name: "Multi-threading", tag: "Concurrency" },
      { name: "Performance", tag: "Optimization" },
    ],
    description:
      "Architecting high-performance native desktop software and utilities engineered for stability, efficient memory lifecycle, and low CPU overhead.",
    highlights: [
      "Modern native C++ desktop software with minimal resource footprint",
      "Safe memory allocation and efficient data structures",
      "Windows system process interfacing and API integration",
      "High-throughput multithreaded architecture and optimization",
    ],
  },
  {
    id: "web-dev",
    code: "WEB // 02",
    title: "Web & Full-Stack Platforms",
    subtitle: "Next.js, React & Vercel",
    icon: Code2,
    items: [
      { name: "Next.js", tag: "App Router" },
      { name: "React", tag: "UI Components" },
      { name: "TypeScript", tag: "Type-Safe" },
      { name: "Vercel", tag: "Edge Runtime" },
      { name: "Tailwind CSS", tag: "Design Systems" },
    ],
    description:
      "Developing high-performance web applications and dashboard platforms with responsive, text-editor inspired interfaces and intuitive user flows.",
    highlights: [
      "Modular Next.js App Router architecture with static export readiness",
      "Vercel edge deployment with instant worldwide CDN delivery",
      "Dynamic dark-mode UI with crisp 1px borders and editorial typography",
      "Optimized client state management and telemetry synchronization",
    ],
  },
  {
    id: "cloud-security",
    code: "OPS // 03",
    title: "Cloud Infrastructure & Security",
    subtitle: "Cloudflare, Supabase & Discord",
    icon: Lock,
    items: [
      { name: "Cloudflare", tag: "DNS & DDoS" },
      { name: "Supabase", tag: "PostgreSQL & Edge" },
      { name: "Discord OAuth2", tag: "SSO & Role Sync" },
      { name: "Vercel", tag: "Serverless" },
      { name: "Row Level Security", tag: "Data Isolation" },
    ],
    description:
      "Deploying resilient edge networks with Cloudflare, Vercel serverless functions, Supabase PostgreSQL, and automated Discord SSO integrations.",
    highlights: [
      "Cloudflare edge caching, SSL/TLS, and global DDoS mitigation",
      "Discord OAuth2 single sign-on with guild role verification",
      "Supabase PostgreSQL data layers with Row Level Security",
      "Secure API endpoints and automated user session provisioning",
    ],
  },
];

export const TechFocus: React.FC = () => {
  return (
    <section id="stack" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#212121] border border-[#3E3E3E] text-[#A09D98] text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05A47]" />
          <span>CAPABILITIES MATRIX // TECHNICAL DOMAINS</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FBF9F6] mb-4">
          Tech Stack &amp; Core Focus
        </h2>

        <p className="max-w-2xl text-[#A09D98] text-sm sm:text-base font-sans leading-relaxed">
          A proven engineering stack spanning low-level native systems development in C++, modern Next.js frontends, and hardened Supabase cloud backends.
        </p>
      </div>

      {/* 3-Column Structured Engineering Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-[#3E3E3E] bg-[#1E1E1E]">
        {FOCUS_AREAS.map((area, idx) => {
          const Icon = area.icon;
          const isNotLast = idx < FOCUS_AREAS.length - 1;
          return (
            <div
              key={area.id}
              className={`p-6 sm:p-7 flex flex-col justify-between ${
                isNotLast ? "border-b md:border-b-0 md:border-r border-[#3E3E3E]" : ""
              }`}
            >
              <div>
                {/* Header Tag & Icon */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#3E3E3E]/60">
                  <span className="font-mono text-xs text-[#E05A47] font-semibold">
                    {area.code}
                  </span>
                  <span className="font-mono text-[11px] text-[#A09D98] bg-[#252525] px-2 py-0.5 border border-[#3E3E3E]">
                    {area.subtitle}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-serif font-bold text-lg text-[#FBF9F6] mb-2 tracking-tight">
                  {area.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A09D98] font-sans leading-relaxed mb-6">
                  {area.description}
                </p>

                {/* Technology chips */}
                <div className="mb-6">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#A09D98] mb-2.5">
                    Stack &amp; Tools
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {area.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#242424] border border-[#3E3E3E] text-xs font-mono"
                      >
                        <span className="text-[#FBF9F6]">{item.name}</span>
                        {item.tag && (
                          <span className="text-[10px] text-[#A09D98] border-l border-[#3E3E3E] pl-1.5">
                            {item.tag}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlights List */}
              <div className="pt-4 border-t border-[#3E3E3E]/60">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#A09D98] mb-2.5">
                  Verified Capabilities
                </div>
                <ul className="space-y-2">
                  {area.highlights.map((h, i) => (
                    <li key={i} className="text-xs text-[#A09D98] flex items-start gap-2">
                      <span className="text-[#E05A47] font-mono mt-0.5">▹</span>
                      <span className="font-sans leading-normal text-[#FBF9F6]/90">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
