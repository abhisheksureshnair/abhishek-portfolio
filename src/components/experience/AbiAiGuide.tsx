'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { PERSONAL_INFO, SELECTED_PROJECTS, PROFESSIONAL_EXPERIENCE } from '../../data/portfolioData';

interface AbiAiGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AbiAiGuide: React.FC<AbiAiGuideProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: `Hi! I'm ABI AI, Abhishek's digital portfolio assistant. Ask me anything about his technical stack, commercial experience at InnSpark Solutions, or flagship projects like FlowSync and Echo Desktop AI!`
    }
  ]);
  const [customInput, setCustomInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const quickQuestions = [
    'What does Abhishek specialize in?',
    'What are his strongest projects?',
    'Show me his AI & LLM work.',
    'How much professional experience does he have?',
    'What technologies does he use?'
  ];

  const handleAsk = (qText: string) => {
    const userMsg = { sender: 'user' as const, text: qText };
    let replyText = '';

    const lower = qText.toLowerCase();

    if (lower.includes('specialize') || lower.includes('do')) {
      replyText = `Abhishek is a Full-Stack Developer specializing in React, React Native, Flutter, Node.js, Express, MongoDB, WebSockets, REST APIs, and AI integrations (NVIDIA NIM APIs). He has 3+ years of professional experience building web, mobile, real-time telemetry, and AI systems.`;
    } else if (lower.includes('strongest') || lower.includes('projects')) {
      replyText = `His flagship projects include: 
1. FlowSync (AI-Powered MERN + NVIDIA NIM real-time task intelligence platform)
2. Echo Desktop AI (Electron + React desktop companion & browser co-pilot)
3. LiveSync (Monorepo family safety & GPS telemetry suite)
4. AlphaPulse Stock AI (FastAPI Python technical analysis + multi-agent market insights)
5. Neon Kinetic Vehicle Tracking (Flutter live GPS fleet telematics).`;
    } else if (lower.includes('ai') || lower.includes('llm') || lower.includes('nvidia')) {
      replyText = `Abhishek's AI work includes integrating NVIDIA NIM APIs into FlowSync for automated sprint task risk scoring, building Echo Desktop AI (Electron app with custom LLM endpoints), and AlphaPulse Stock AI (Python FastAPI server with multi-agent investment reasoning).`;
    } else if (lower.includes('experience') || lower.includes('innspark')) {
      replyText = `Abhishek has 3+ years of professional software engineering experience as an Analyst — Software Development at InnSpark Solutions Pvt. Ltd. (Jun 2023 – Present). He has deployed 5+ production mobile applications to the App Store and Google Play Store spanning telemedicine, fleet telematics, parental security, and Bluetooth BLE hardware IoT.`;
    } else if (lower.includes('tech') || lower.includes('stack')) {
      replyText = `His technical toolbox includes:
• Frontend: React, JavaScript (ES6+), Vite, React Router, Tailwind CSS, GSAP
• Mobile: React Native, Flutter, Dart, iOS & Android Native Releases
• Backend: Node.js, Express.js, Socket.IO, WebSockets, FastAPI (Python), REST APIs
• Database: MongoDB Atlas, Mongoose ORM, Firebase Firestore
• AI: NVIDIA NIM APIs, OpenAI API, Multi-Agent Workflows
• Connected Systems: Bluetooth BLE, GPS Telemetry, Geofencing, Electron.`;
    } else {
      replyText = `Abhishek is a Full-Stack Developer with 3+ years experience building Web, Mobile & AI products. Feel free to explore his selected work or click 'Download Resume'!`;
    }

    setMessages((prev) => [...prev, userMsg, { sender: 'bot', text: replyText }]);
    setCustomInput('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Assistant Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 font-mono my-auto flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">ABI AI Assistant</h3>
                <p className="text-[10px] text-emerald-400">● Live Portfolio Knowledge Base</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs font-sans">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center flex-shrink-0 text-xs">
                    🤖
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none whitespace-pre-line font-light'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/40">
            <span className="text-[10px] font-mono text-zinc-500 block mb-2 px-1">Suggested Questions:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(q)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-indigo-300 hover:text-white transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customInput.trim()) handleAsk(customInput);
            }}
            className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2"
          >
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ask ABI AI a question..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
