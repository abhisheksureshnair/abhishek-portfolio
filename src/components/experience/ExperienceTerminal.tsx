'use client';

import React, { useState } from 'react';
import { Terminal, CornerDownLeft } from 'lucide-react';
import { EXPERIENCE_DATA } from './ExperienceData';

export const ExperienceTerminal: React.FC = () => {
  const [history, setHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'whoami',
      output:
        'Abhishek S Nair\nSoftware Developer (Web • Mobile • AI Applications)\nOfficial Role: Analyst — InnSpark Solutions Pvt. Ltd. (Software Development)',
    },
    {
      cmd: 'skills',
      output:
        'Frontend: JavaScript (ES6+), React.js, Vite, HTML5, CSS3, Responsive UI\nBackend: Node.js, Express.js, REST APIs, WebSockets, Socket.IO, JWT\nMobile & Cross-Platform: React Native, Flutter, Android, iOS\nDatabases: MongoDB, MySQL, Firebase Realtime Database\nAI & LLMs: LLM Integration, NVIDIA LLM API, Prompt Engineering\nIntegrations: Google Maps API, GPS, Bluetooth BLE, Firebase Auth\nDesktop: Electron.js\nTools: Git, GitHub, VS Code, Postman',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    const matched = EXPERIENCE_DATA.terminalCommands.find((c) => c.cmd === trimmed);
    let output = '';
    if (matched) {
      output = matched.output;
    } else if (trimmed === 'help') {
      output = 'Available commands: whoami, skills, projects, experience, education, contact, clear';
    } else {
      output = `Command not found: "${cmd}". Type "help" for a list of available system commands.`;
    }

    setHistory((prev) => [...prev, { cmd, output }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputVal.trim()) {
      runCommand(inputVal);
    }
  };

  return (
    <section
      id="terminal"
      className="relative z-20 bg-[#050505] px-6 py-20 sm:px-12 md:px-20 lg:px-28 border-t border-white/10"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-cyan-400 backdrop-blur-md">
            <Terminal className="h-3.5 w-3.5" />
            <span>Interactive Terminal Interface</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Developer <span className="text-cyan-400">Terminal.</span>
          </h3>

          <p className="text-sm sm:text-base text-neutral-400 font-light max-w-xl">
            Direct access to verified employment records, mobile hardware architectures, and full-stack MERN &amp; AI source registries.
          </p>
        </div>

        {/* Quick Command Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-500 mr-2">Quick run:</span>
          {['whoami', 'skills', 'projects', 'experience', 'education', 'contact', 'clear'].map(
            (cmd) => (
              <button
                key={cmd}
                onClick={() => runCommand(cmd)}
                className="rounded-lg border border-white/10 bg-neutral-900/80 px-3 py-1 text-xs font-mono text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors"
              >
                $ {cmd}
              </button>
            )
          )}
        </div>

        {/* Terminal Window Box */}
        <div className="rounded-2xl border border-white/15 bg-[#080808] shadow-[0_0_50px_rgba(0,229,255,0.08)] overflow-hidden font-mono text-xs sm:text-sm">
          {/* Terminal Window Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-neutral-950 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-neutral-400">abhishek@workstation:~ (zsh)</span>
            <span className="text-[11px] text-cyan-400 font-bold">NODE v20.x • MERN</span>
          </div>

          {/* Terminal Body */}
          <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400">
                  <span className="text-neutral-500">➜</span>
                  <span className="text-amber-400 font-semibold">abhishek@dev</span>
                  <span className="text-neutral-500">:~$</span>
                  <span className="text-white font-medium">{item.cmd}</span>
                </div>
                <div className="whitespace-pre-wrap text-neutral-300 pl-4 border-l-2 border-white/10 leading-relaxed font-sans sm:font-mono text-xs">
                  {item.output}
                </div>
              </div>
            ))}

            {/* Live Prompt Input */}
            <div className="flex items-center gap-2 text-cyan-400 pt-2">
              <span className="text-neutral-500">➜</span>
              <span className="text-amber-400 font-semibold">abhishek@dev</span>
              <span className="text-neutral-500">:~$</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type a command (try 'skills' or 'projects')..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-neutral-600 font-mono text-xs sm:text-sm"
              />
              <button
                onClick={() => inputVal.trim() && runCommand(inputVal)}
                className="text-neutral-500 hover:text-cyan-400"
              >
                <CornerDownLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
