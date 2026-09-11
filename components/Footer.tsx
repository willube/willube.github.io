"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, ArrowUp, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-[#3E3E3E] bg-[#191919] py-8 px-4 mt-20 font-mono text-xs text-[#A09D98]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Brand & Editorial Byline */}
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-[#FBF9F6] tracking-wider">AURY</span>
            <span className="text-[11px] text-[#E05A47]">// FOUNDER &amp; LEAD DEV OF DEADSENSE</span>
          </div>
          <p className="text-[11px] text-[#73716C] font-sans">
            &copy; {new Date().getFullYear()} Aury. Deployed on Vercel &amp; Cloudflare with Next.js and Tailwind CSS.
          </p>
        </div>

        {/* Status Bar Telemetry */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#212121] border border-[#3E3E3E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E05A47]" />
            <span className="text-[#FBF9F6]">CLOUDFLARE &amp; VERCEL // OK</span>
          </div>
          <div className="px-2.5 py-1 bg-[#212121] border border-[#3E3E3E] text-[#A09D98]">
            git:(main)
          </div>
          {timeStr && (
            <div className="px-2.5 py-1 bg-[#212121] border border-[#3E3E3E] text-[#FBF9F6]">
              {timeStr}
            </div>
          )}
        </div>

        {/* Quick Links & Back to Top */}
        <div className="flex items-center gap-2">
          <a
            href="https://deadsense.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#212121] hover:bg-[#282828] border border-[#3E3E3E] text-[#A09D98] hover:text-[#FBF9F6] transition-colors"
            aria-label="DeadSense Website"
          >
            <Globe className="w-3.5 h-3.5" />
          </a>
          <a
            href="#contact"
            className="p-2 bg-[#212121] hover:bg-[#282828] border border-[#3E3E3E] text-[#A09D98] hover:text-[#FBF9F6] transition-colors"
            aria-label="Contact Section"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={scrollToTop}
            className="p-2 bg-[#212121] hover:bg-[#282828] border border-[#3E3E3E] text-[#E05A47] hover:border-[#E05A47] transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
