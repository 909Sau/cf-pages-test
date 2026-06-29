import React from 'react';
import { Film, Sliders, Sparkles } from 'lucide-react';

export default function Header({ onOpenInspect, currentTier, onReset }) {
  return (
    <header className="glass-panel sticky top-0 z-50 px-6 py-4 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10" style={{ borderRadius: 0 }}>
      <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Film className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-title">
            Movie Taste Lab
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-cyan-300 font-normal">
              Tier {currentTier}
            </span>
          </h1>
          <p className="text-xs text-slate-400">The Near-Twin Cinema Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenInspect}
          className="btn-secondary text-sm !padding-x-4 !padding-y-2 border-cyan-500/30 hover:border-cyan-400 text-cyan-300"
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Inspect Taste Model (G3)</span>
        </button>
      </div>
    </header>
  );
}
