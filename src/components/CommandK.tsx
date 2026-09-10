'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, FileText, Mail, ExternalLink, Code2, Sparkles, X } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './Icons';
import { PERSONAL_INFO, SELECTED_PROJECTS } from '../data/portfolioData';

interface CommandKProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  onOpenFlowSyncCaseStudy: () => void;
}

export const CommandK: React.FC<CommandKProps> = ({
  isOpen,
  onClose,
  onOpenResume,
  onOpenFlowSyncCaseStudy,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'flowsync',
      title: 'FlowSync Case Study',
      subtitle: 'Flagship MERN + NVIDIA NIM AI platform',
      icon: Sparkles,
      action: () => {
        onClose();
        onOpenFlowSyncCaseStudy();
      },
    },
    {
      id: 'resume',
      title: 'View & Download Resume',
      subtitle: 'Complete curriculum vitae (PDF)',
      icon: FileText,
      action: () => {
        onClose();
        onOpenResume();
      },
    },
    {
      id: 'github',
      title: 'Open GitHub Profile',
      subtitle: 'github.com/abhisheksureshnair',
      icon: GithubIcon,
      action: () => {
        window.open(PERSONAL_INFO.github, '_blank');
      },
    },
    {
      id: 'linkedin',
      title: 'Connect on LinkedIn',
      subtitle: 'linkedin.com/in/abhisheksnair',
      icon: LinkedinIcon,
      action: () => {
        window.open(PERSONAL_INFO.linkedin, '_blank');
      },
    },
    {
      id: 'email',
      title: 'Send Direct Email',
      subtitle: PERSONAL_INFO.email,
      icon: Mail,
      action: () => {
        window.location.href = `mailto:${PERSONAL_INFO.email}`;
      },
    },
  ];

  const filteredActions = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 border-b border-zinc-800 bg-zinc-900/50">
            <Search className="w-5 h-5 text-zinc-500 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search project..."
              className="w-full py-4 bg-transparent text-white text-sm focus:outline-none placeholder-zinc-500 font-mono"
            />
            <button onClick={onClose} className="p-1 rounded bg-zinc-800 text-zinc-400 text-xs">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Result List */}
          <div className="p-2 max-h-80 overflow-y-auto space-y-1">
            {filteredActions.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 font-mono">
                No matching results found for "{query}"
              </div>
            ) : (
              filteredActions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full p-3 rounded-xl hover:bg-zinc-900 flex items-center justify-between text-left group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-indigo-300">
                          {item.title}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-500">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
                  </button>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Navigation Shortcut</span>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">ESC</kbd> to close
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
