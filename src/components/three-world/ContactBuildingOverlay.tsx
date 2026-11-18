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
  FileText,
  Briefcase,
  Layers,
  Smartphone,
  Cpu,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/Icons';
import { CONTACT_HUB_METADATA, CollaborationOffering } from '@/world/buildings/contact/contactMetadata';

interface ContactBuildingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'form' | 'socials' | 'collaboration' | 'resume';
}

export const ContactBuildingOverlay: React.FC<ContactBuildingOverlayProps> = ({
  isOpen,
  onClose,
  initialTab = 'form',
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'socials' | 'collaboration' | 'resume'>(initialTab);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
    hp_source: '', // Honeypot field for bot spam trap
  });
  const [formRenderTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusFeedback, setStatusFeedback] = useState<{ message: string; inquiryId?: string; deliveryStatus?: string }>({
    message: '',
  });
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);

  // Synchronize initialTab if changed externally
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // ESC key listener to close overlay
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // One-click copy email
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_HUB_METADATA.identity.email);
      setHasCopiedEmail(true);
      setTimeout(() => setHasCopiedEmail(false), 2500);
    } catch (e) {
      console.error('Failed to copy email:', e);
    }
  };

  // Pre-fill subject from collaboration card and switch to form tab
  const handleSelectCollaboration = (offering: CollaborationOffering) => {
    setFormData((prev) => ({
      ...prev,
      subject: `Collaboration: ${offering.title}`,
      message: `Hi Abhishek,\n\nI am interested in collaborating on ${offering.title} (${offering.subtitle}).\n\nProject Overview:\n`,
    }));
    setActiveTab('form');
  };

  // Real backend submission calling /api/contact
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setSubmitStatus('error');
      setStatusFeedback({ message: 'Please provide your full name (at least 2 characters).' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setSubmitStatus('error');
      setStatusFeedback({ message: 'Please provide a valid email address so I can reply.' });
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setSubmitStatus('error');
      setStatusFeedback({ message: 'Please enter a message of at least 10 characters.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusFeedback({ message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _timestamp: formRenderTime,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitStatus('success');
        setStatusFeedback({
          message: data.message || 'Your message has been safely received.',
          inquiryId: data.inquiryId,
          deliveryStatus: data.deliveryStatus,
        });
        setFormData({
          name: '',
          email: '',
          subject: 'General Inquiry',
          message: '',
          hp_source: '',
        });
      } else {
        setSubmitStatus('error');
        setStatusFeedback({
          message: data.error || 'Failed to dispatch message. Direct email is available below.',
        });
      }
    } catch (err) {
      setSubmitStatus('error');
      setStatusFeedback({
        message: 'Network error communicating with the API. Please reach out directly via email.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md font-mono pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden text-slate-100"
          >
            {/* Top Cyan & Silver Futuristic Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500" />

            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-cyan-500/20 bg-slate-900/40">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                    DISTRICT 06 // CONTACT & COLLABORATION HUB
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-500/10 text-sky-300 border border-sky-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Channels Active & Verified
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Contact & Collaboration Terminal
                </h2>
                <p className="text-xs text-slate-400">
                  Direct inquiries, professional channels, collaboration showcase, and official resume access.
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

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800/80 bg-slate-950/60 px-5 sm:px-6 overflow-x-auto gap-2">
              {[
                { id: 'form', label: 'Direct Message', icon: MessageSquare },
                { id: 'socials', label: 'Professional Networks', icon: Globe },
                { id: 'collaboration', label: 'Collaboration Showcase', icon: Briefcase },
                { id: 'resume', label: 'Resume & Credentials', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* TAB 1: DIRECT MESSAGE FORM */}
              {activeTab === 'form' && (
                <div className="space-y-6">
                  {/* Quick Dispatch Badge & Identity Card */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-sm">
                        AN
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{CONTACT_HUB_METADATA.identity.name}</div>
                        <div className="text-xs text-cyan-400">{CONTACT_HUB_METADATA.identity.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyEmail}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2 border border-slate-700"
                      >
                        {hasCopiedEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{CONTACT_HUB_METADATA.identity.email}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submission Status Alerts */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-2"
                    >
                      <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>Transmission Successfully Received!</span>
                      </div>
                      <p className="text-xs text-emerald-200/90">{statusFeedback.message}</p>
                      {statusFeedback.inquiryId && (
                        <div className="text-[11px] text-emerald-400/80 font-mono">
                          Reference ID: <span className="underline">{statusFeedback.inquiryId}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-rose-300">Submission Blocked:</span>
                        <p>{statusFeedback.message}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Contact Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Honeypot Spam Protection (Hidden from legitimate users) */}
                    <input
                      type="text"
                      name="hp_source"
                      value={formData.hp_source}
                      onChange={(e) => setFormData({ ...formData, hp_source: e.target.value })}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name Field */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Your Name *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Sarah Connor"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-xs text-white placeholder-slate-500"
                        />
                      </div>

                      {/* Email Field */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Your Email Address *</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. sarah@cyberdyne.io"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-xs text-white placeholder-slate-500"
                        />
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Inquiry Subject *</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-xs text-white"
                        >
                          {CONTACT_HUB_METADATA.inquiryTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                          {formData.subject && !CONTACT_HUB_METADATA.inquiryTypes.includes(formData.subject) && (
                            <option value={formData.subject}>{formData.subject}</option>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Your Message *</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your project, team goals, timeline, or engineering inquiry in detail..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-xs text-white placeholder-slate-500 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Validating & Dispatching...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message to Abhishek</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: PROFESSIONAL NETWORKS */}
              {activeTab === 'socials' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400">
                    Verified profiles, code repositories, professional networks, and portfolio endpoints.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CONTACT_HUB_METADATA.channels.map((ch) => (
                      <div
                        key={ch.id}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 font-bold text-sm text-white">
                              {ch.icon === 'github' && <GithubIcon className="w-4 h-4 text-slate-200" />}
                              {ch.icon === 'linkedin' && <LinkedinIcon className="w-4 h-4 text-sky-400" />}
                              {ch.icon === 'portfolio' && <Globe className="w-4 h-4 text-cyan-400" />}
                              {ch.icon === 'email' && <Mail className="w-4 h-4 text-rose-400" />}
                              <span>{ch.name}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                              {ch.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{ch.description}</p>
                          <div className="text-[11px] font-mono text-cyan-400/90 truncate">{ch.handle}</div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-end">
                          <a
                            href={ch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-cyan-500/30"
                          >
                            <span>Open Link</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: COLLABORATION SHOWCASE */}
              {activeTab === 'collaboration' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400">
                    Select a collaboration domain to initiate a tailored technical project or engineering partnership.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CONTACT_HUB_METADATA.offerings.map((offering) => (
                      <div
                        key={offering.id}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                              {offering.tag}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{offering.title}</h4>
                          <p className="text-xs text-slate-300 font-medium">{offering.subtitle}</p>
                          <p className="text-xs text-slate-400 leading-relaxed">{offering.description}</p>

                          {/* Tech Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {offering.technologies.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/60">
                          <button
                            onClick={() => handleSelectCollaboration(offering)}
                            className="w-full py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-cyan-500/30"
                          >
                            <span>Initiate Inquiry</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: RESUME & CREDENTIALS */}
              {activeTab === 'resume' && (
                <div className="space-y-6">
                  {/* Verified Qualifications Overview */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Official Curriculum Vitae & Credentials</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Comprehensive overview of production engineering accomplishments, systems architecture, 3.6+ years of verified software development, and academic degrees.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Experience</div>
                        <div className="text-sm font-bold text-white mt-1">3.6+ Years</div>
                        <div className="text-[11px] text-cyan-400">Full-Stack & Mobile</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Postgraduate</div>
                        <div className="text-sm font-bold text-white mt-1">MCA (AI Focus)</div>
                        <div className="text-[11px] text-cyan-400">72% • Manipal Univ.</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Undergraduate</div>
                        <div className="text-sm font-bold text-white mt-1">B.Sc. Comp Sci</div>
                        <div className="text-[11px] text-cyan-400">Mannam Memorial NSS</div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Download & View Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Resume (PDF)</span>
                    </a>

                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition-colors border border-slate-700 flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span>View in Browser Tab</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Direct Information */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{CONTACT_HUB_METADATA.identity.location}</span>
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{CONTACT_HUB_METADATA.identity.availability}</span>
                </span>
              </div>

              <div className="text-[11px] text-slate-500">
                District 06 // Contact & Collaboration Hub
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
