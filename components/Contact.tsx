"use client";

import React, { useState } from "react";
import {
  Mail,
  MessageSquare,
  Copy,
  Check,
  Send,
  Globe,
  ArrowUpRight,
  Terminal,
} from "lucide-react";

export const Contact: React.FC = () => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const discordHandle = "zetg";
  const contactEmail = "privataury@gmail.com";

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => {
      setCopiedItem(null);
    }, 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setFormSubmitted(false), 5000);
    }, 500);
  };

  return (
    <section id="contact" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#212121] border border-[#3E3E3E] text-[#A09D98] text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05A47]" />
          <span>COMMUNICATION // DIRECT REACH</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FBF9F6] mb-4">
          Get In Touch
        </h2>

        <p className="max-w-xl text-[#A09D98] text-sm sm:text-base font-sans leading-relaxed">
          For inquiries regarding DeadSense, systems programming, full-stack web architecture, or collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fast Connect Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Discord Card */}
          <div className="p-5 border border-[#3E3E3E] bg-[#1E1E1E] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-[#252525] border border-[#3E3E3E] text-[#E05A47]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-mono text-[#A09D98] uppercase">Discord Direct</div>
                <div className="text-sm font-mono text-[#FBF9F6] font-medium">@{discordHandle}</div>
              </div>
            </div>
            <button
              onClick={() => handleCopy(discordHandle, "discord")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-[#2C2C2C] border border-[#3E3E3E] text-[#FBF9F6] text-xs font-mono transition-colors"
            >
              {copiedItem === "discord" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E05A47]" />
                  <span className="text-[#E05A47]">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 opacity-70" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>

          {/* Email Direct Card */}
          <div className="p-5 border border-[#3E3E3E] bg-[#1E1E1E] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-[#252525] border border-[#3E3E3E] text-[#E05A47]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-mono text-[#A09D98] uppercase">Email Contact</div>
                <div className="text-sm font-mono text-[#FBF9F6] font-medium">{contactEmail}</div>
              </div>
            </div>
            <button
              onClick={() => handleCopy(contactEmail, "email")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-[#2C2C2C] border border-[#3E3E3E] text-[#FBF9F6] text-xs font-mono transition-colors"
            >
              {copiedItem === "email" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E05A47]" />
                  <span className="text-[#E05A47]">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 opacity-70" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>

          {/* DeadSense Platform Card */}
          <div className="p-5 border border-[#3E3E3E] bg-[#1E1E1E] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-[#252525] border border-[#3E3E3E] text-[#E05A47]">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-mono text-[#A09D98] uppercase">DeadSense Suite</div>
                <div className="text-sm font-mono text-[#FBF9F6] font-medium">deadsense.cc</div>
              </div>
            </div>
            <a
              href="https://deadsense.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-[#2C2C2C] border border-[#3E3E3E] text-[#FBF9F6] text-xs font-mono transition-colors"
            >
              <span>VISIT</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* Notice */}
          <div className="p-4 border border-[#3E3E3E] bg-[#191919] font-mono text-xs text-[#A09D98] flex items-start gap-2.5">
            <span className="text-[#E05A47] mt-0.5">ℹ</span>
            <span className="leading-relaxed">
              Available for software engineering inquiries, full-stack systems, and collaboration.
            </span>
          </div>
        </div>

        {/* Right Column: Direct Message Form */}
        <div className="lg:col-span-7">
          <div className="border border-[#3E3E3E] bg-[#1E1E1E] overflow-hidden">
            {/* Editor Window Title Bar */}
            <div className="px-4 py-2.5 bg-[#252525] border-b border-[#3E3E3E] flex items-center justify-between font-mono text-xs text-[#A09D98]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3E3E3E]" />
                <span className="w-2 h-2 rounded-full bg-[#3E3E3E]" />
                <span className="w-2 h-2 rounded-full bg-[#3E3E3E]" />
                <span className="ml-2 text-[#FBF9F6]">message_compose.txt</span>
              </div>
              <span>UTF-8</span>
            </div>

            <div className="p-6">
              {formSubmitted ? (
                <div className="p-8 border border-[#3E3E3E] bg-[#222222] text-center space-y-2 font-mono">
                  <div className="inline-flex p-2 bg-[#252525] border border-[#3E3E3E] text-[#E05A47] mb-2">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#FBF9F6]">Message Transmitted</h4>
                  <p className="text-xs text-[#A09D98] font-sans">
                    Thank you for reaching out. I will review your note and respond promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[11px] uppercase tracking-wider text-[#A09D98] mb-1.5"
                      >
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex"
                        className="w-full px-3.5 py-2.5 bg-[#191919] border border-[#3E3E3E] text-[#FBF9F6] placeholder-[#73716C] text-xs focus:outline-none focus:border-[#E05A47] transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[11px] uppercase tracking-wider text-[#A09D98] mb-1.5"
                      >
                        Your Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@example.com"
                        className="w-full px-3.5 py-2.5 bg-[#191919] border border-[#3E3E3E] text-[#FBF9F6] placeholder-[#73716C] text-xs focus:outline-none focus:border-[#E05A47] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[11px] uppercase tracking-wider text-[#A09D98] mb-1.5"
                    >
                      Message / Project Details
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your project inquiry, licensing questions, or custom requirements..."
                      className="w-full px-3.5 py-2.5 bg-[#191919] border border-[#3E3E3E] text-[#FBF9F6] placeholder-[#73716C] text-xs focus:outline-none focus:border-[#E05A47] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#E05A47] hover:bg-[#C84A38] text-[#FBF9F6] text-xs font-mono font-semibold uppercase tracking-wider transition-colors active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-[#FBF9F6]/30 border-t-[#FBF9F6] rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
