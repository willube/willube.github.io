"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Menu,
  X,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "DeadSense", href: "#deadsense" },
  { name: "Architecture", href: "#architecture" },
  { name: "Tech Stack", href: "#stack" },
  { name: "Contact", href: "#contact" },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pt-3 sm:pt-4">
      <nav
        className={cn(
          "w-full max-w-5xl rounded-sm transition-colors duration-150 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border",
          scrolled
            ? "bg-[#191919]/95 backdrop-blur-md border-[#3E3E3E]"
            : "bg-[#191919]/80 backdrop-blur-sm border-[#3E3E3E]/80"
        )}
      >
        {/* Brand / Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group transition-colors"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-[#212121] border border-[#3E3E3E] group-hover:border-[#E05A47] transition-colors">
            <Terminal className="w-3.5 h-3.5 text-[#E05A47]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-base tracking-tight text-[#FBF9F6]">
              Aury
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-[#A09D98] tracking-tight">
              // deadsense.cc
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 font-mono text-xs">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-3 py-1.5 text-[#A09D98] hover:text-[#FBF9F6] transition-colors rounded-none hover:bg-[#252525]"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 font-mono text-xs">
          <a
            href="https://deadsense.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#212121] border border-[#3E3E3E] text-[#FBF9F6] hover:border-[#E05A47] hover:text-[#E05A47] transition-colors"
          >
            <span>deadsense.cc</span>
            <ArrowUpRight className="w-3 h-3 opacity-70" />
          </a>

          <a
            href="#contact"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#E05A47] hover:bg-[#C84A38] text-[#FBF9F6] font-medium transition-colors"
          >
            <span>Connect</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-[#A09D98] hover:text-[#FBF9F6] focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-[#FBF9F6]" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-14 left-3 right-3 p-4 rounded-sm bg-[#1F1F1F] border border-[#3E3E3E] md:hidden z-50 flex flex-col gap-2 font-mono text-xs"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 text-[#A09D98] hover:text-[#FBF9F6] hover:bg-[#252525] rounded-none transition-colors"
              >
                {item.name}
              </a>
            ))}
            <div className="pt-2 mt-1 border-t border-[#3E3E3E] flex items-center justify-between gap-2">
              <a
                href="https://deadsense.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[#FBF9F6] bg-[#242424] border border-[#3E3E3E]"
              >
                <span>deadsense.cc</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[#FBF9F6] bg-[#E05A47]"
              >
                Connect
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
