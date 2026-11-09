'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Send,
  Check,
  Copy,
  ExternalLink,
  Globe,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Radio,
  User,
  AlertCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/Icons';

interface ContactBuildingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const VERIFIED_CONTACT = {
  email: 'nairsabhishek@gmail.com',
  github: 'https://github.com/abhisheksureshnair',
  linkedin: 'https://www.linkedin.com/in/abhisheksnair',
  portfolio: 'https://abhisheksnair.vercel.app',
  location: 'Kerala, India',
  availability: 'Open for Roles & Product Engineering Teams',
};

export const ContactBuildingOverlay: React.FC<ContactBuildingOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);

  // ESC key listener to restore city view
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle one-click copy email
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(VERIFIED_CONTACT.email);
      setHasCopiedEmail(true);
      setTimeout(() => setHasCopiedEmail(false), 2500);
    } catch (e) {
      console.error('Failed to copy email:', e);
    }
  };

  // Real backend submission calling /api/contact
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to deliver message. Please use direct email.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage('Network error connecting to API. Direct email is available below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md font-mono pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-950/95 border border-pink-500/40 rounded-2xl shadow-[0_0_60px_rgba(236,72,153,0.25)] overflow-hidden"
          >
            {/* Top Pink & Cyan Cyber Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-400" />

            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-pink-500/20 bg-slate-900/40">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-pink-400 animate-pulse" />
                    CONTACT HUB // LIVE TRANSCEIVER
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Channels Active
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Get in Touch with Abhishek
                </h2>
                <p className="text-xs text-slate-300">
                  Direct communication channels, verified social profiles, and working backend submission.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* 1. Verified Direct Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email Direct Channel */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-pink-500/20 hover:border-pink-500/50 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold text-pink-400">
                      <Mail className="w-4 h-4 text-pink-400" />
                      <span>Direct Email</span>
                    </span>
                    <button
                      onClick={handleCopyEmail}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                      title="Copy email address"
                    >
                      {hasCopiedEmail ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <a
                    href={`mailto:${VERIFIED_CONTACT.email}`}
                    className="text-sm font-bold text-white hover:text-pink-400 transition-colors block truncate"
                  >
                    {VERIFIED_CONTACT.email}
                  </a>
                  <p className="text-[11px] text-slate-400">
                    Primary inbox for engineering roles, technical inquiries, and project discussions.
                  </p>
                </div>

                {/* LinkedIn Profile */}
                <a
                  href={VERIFIED_CONTACT.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                      <LinkedinIcon className="w-4 h-4 text-cyan-400" />
                      <span>LinkedIn Profile</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    linkedin.com/in/abhisheksnair
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Professional network, software engineering journey & recommendations.
                  </p>
                </a>

                {/* GitHub Profile */}
                <a
                  href={VERIFIED_CONTACT.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-pink-500/50 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold text-pink-400">
                      <GithubIcon className="w-4 h-4 text-pink-400" />
                      <span>GitHub Repositories</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-400 transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                    github.com/abhisheksureshnair
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Open-source repositories, FlowSync, Echo Desktop AI, and personal code builds.
                  </p>
                </a>

                {/* Live Portfolio */}
                <a
                  href={VERIFIED_CONTACT.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>Live Portfolio Web</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    abhisheksnair.vercel.app
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Interactive classic portfolio with project case studies and terminal simulator.
                  </p>
                </a>
              </div>

              {/* 2. Interactive Contact Form with Real /api/contact Endpoint */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-pink-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Send a Message
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    API Status: Active (/api/contact)
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300" htmlFor="contact-name">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Connor"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-pink-500 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300" htmlFor="contact-email">
                        Your Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. sarah@example.com"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-pink-500 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300" htmlFor="contact-message">
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Abhishek, let's connect regarding a software developer position or project..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-pink-500 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors resize-none"
                    />
                  </div>

                  {/* Feedback states */}
                  {submitStatus === 'success' && (
                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Thank you! Your message was transmitted to Abhishek&apos;s verified inbox.</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Typical response time: within 24 hours</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-pink-600/30 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Transmission</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-pink-500/20 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <kbd>ESC</kbd>
                </span>
                <span>or Back to City to resume 3D orbit</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-pink-600/30 flex items-center gap-2"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Back to City</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

