'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ChevronDown, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';
import { CERTIFICATIONS } from '../data/portfolioData';

export const CertificationsSection: React.FC = () => {
  const [expandedCertId, setExpandedCertId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCertId(expandedCertId === id ? null : id);
  };

  return (
    <section id="certifications" className="py-24 bg-zinc-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>// Continuous Learning</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Verified Certifications
            </h2>
          </div>
          <p className="max-w-md text-zinc-400 text-sm font-light leading-relaxed">
            Professional certifications and coursework from IBM, Microsoft, Packt, Queen Mary University of London, and Coursera.
          </p>
        </div>

        {/* Certifications List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {CERTIFICATIONS.map((cert) => {
            const isExpanded = expandedCertId === cert.id;
            return (
              <div
                key={cert.id}
                className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all"
              >
                <button
                  onClick={() => toggleExpand(cert.id)}
                  className="w-full text-left flex items-center justify-between group"
                  data-cursor="pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block mb-1">
                        {cert.issuer} • {cert.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {cert.title}
                      </h3>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-indigo-400' : 'group-hover:text-zinc-300'
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pt-4 mt-4 border-t border-zinc-800/60"
                    >
                      <span className="text-xs font-mono text-zinc-500 block mb-2">Verified Competencies Covered:</span>
                      <div className="flex flex-wrap gap-2">
                        {cert.skillsCovered.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
