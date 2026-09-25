'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowUpRight, 
  FileText, 
  MapPin, 
  Terminal,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../data/portfolioData';
import { LinkedinIcon, GithubIcon } from './Icons';

interface ContactSectionProps {
  onOpenResume?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenResume }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    try {
      // 1. Post to internal Next.js API route
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // 2. Direct client-side mailto fallback dispatch to nairsabhishek@gmail.com
      const mailtoSubject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

      setIsSubmitting(false);
      setFormSubmitted(true);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#38bdf8', '#c084fc', '#34d399']
        });
      } catch (err) {}
    } catch (err) {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-36 bg-[#030508] relative border-t border-white/5 overflow-hidden">
      
      {/* Background Cinematic Glow Elements */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-t from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute inset-0 bg-cinematic-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Massive Cinematic Heading */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-cyan-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>LET'S CONNECT & COLLABORATE</span>
          </div>

          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none">
            LET'S BUILD SOMETHING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-purple-300 animate-shimmer">
              TOGETHER.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-light max-w-xl mx-auto pt-4 leading-relaxed">
            Available for software development roles, web &amp; mobile applications, and AI-powered product engineering. Let&apos;s discuss your next project.
          </p>
        </div>

        {/* 2-Column Contact Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-28">
          
          {/* Left Column: Direct Links & Resume */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-6 shadow-2xl glass-panel-cinematic">
              <h3 className="text-xl font-black text-white tracking-tight">Direct Channels</h3>
              
              {/* Copy Email Box */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Direct Email</span>
                    <span className="text-xs sm:text-sm font-mono text-white font-medium">{PERSONAL_INFO.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-white/10"
                  title="Copy Email Address"
                  data-cursor="pointer"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Social Channels */}
              <div className="space-y-3">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-indigo-500/50 flex items-center justify-between group transition-all"
                  data-cursor="pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-zinc-950 text-zinc-400 group-hover:text-white transition-colors">
                      <GithubIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">GitHub Profile</span>
                      <span className="text-[11px] font-mono text-zinc-500">github.com/abhisheksureshnair</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                </a>

                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-cyan-500/50 flex items-center justify-between group transition-all"
                  data-cursor="pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-zinc-950 text-zinc-400 group-hover:text-white transition-colors">
                      <LinkedinIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">LinkedIn Network</span>
                      <span className="text-[11px] font-mono text-zinc-500">linkedin.com/in/abhisheksnair</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                </a>
              </div>

              {/* Download Resume Action */}
              <div className="pt-2">
                {onOpenResume ? (
                  <button
                    onClick={onOpenResume}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
                    data-cursor="pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>VIEW & DOWNLOAD RESUME (PDF)</span>
                  </button>
                ) : (
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
                    data-cursor="pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>DOWNLOAD LATEST RESUME (PDF)</span>
                  </a>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 text-xs font-mono text-zinc-500 flex items-center justify-between">
                <span>Location: <strong className="text-zinc-300">Kerala, India</strong></span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Available for Hire
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950/80 border border-white/10 glass-panel-cinematic shadow-2xl">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Message Dispatched!</h3>
                  <p className="text-sm text-zinc-400 font-light max-w-md mx-auto">
                    Thank you, {formData.name}. Your message has been routed directly to <strong>{PERSONAL_INFO.email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono border border-white/10 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-black text-white tracking-tight">Direct Message Dispatch</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-2">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        data-cursor="text"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-2">Your Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        data-cursor="text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-2">Message or Opportunity Details</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Abhishek, I would like to discuss..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      data-cursor="text"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50"
                    data-cursor="pointer"
                  >
                    {isSubmitting ? (
                      <span className="font-mono text-xs">Dispatching message to mail server...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND MESSAGE TO EMAIL</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Final Animated ASN Brand Monogram Sign-Off */}
        <div className="flex flex-col items-center justify-center text-center space-y-6 pt-16 border-t border-white/10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-zinc-900 to-black border-2 border-indigo-500/40 flex items-center justify-center shadow-2xl shadow-indigo-500/20 group">
              <span className="font-mono text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-cyan-300">
                ASN
              </span>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2 rounded-3xl border border-indigo-500/20 border-dashed pointer-events-none"
            />
          </motion.div>

          <div className="space-y-1">
            <h4 className="font-mono text-sm font-bold tracking-widest text-white uppercase">
              Abhishek S Nair
            </h4>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Full Stack React Developer • Kerala, India
            </p>
          </div>
        </div>

        {/* Minimal Footer Links */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 font-mono gap-4">
          <div>
            © {new Date().getFullYear()} Abhishek S Nair. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Home</a>
            <a href="#about" className="hover:text-zinc-300 transition-colors">About</a>
            <a href="#experience" className="hover:text-zinc-300 transition-colors">Experience</a>
            <a href="#projects" className="hover:text-zinc-300 transition-colors">Projects</a>
            <a href="#stack" className="hover:text-zinc-300 transition-colors">Stack</a>
            <a href="#ai" className="hover:text-zinc-300 transition-colors">AI</a>
            <a href="#journey" className="hover:text-zinc-300 transition-colors">Journey</a>
          </div>
        </div>

      </div>
    </section>
  );
};
