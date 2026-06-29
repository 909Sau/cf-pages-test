import React from 'react';
import PosterTile from './PosterTile';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

export default function Tier1Landing({ pool, selectedIds, onToggle, onSubmit, onRedraw }) {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 text-cyan-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Tier 1 — Zero Friction Front Door</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 font-title">
          Tap the blockbusters you <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400">liked</span>.
        </h2>
        <p className="text-base text-slate-300 leading-relaxed">
          Untapped titles automatically register as disliked. We capture the underlying execution delta between near-twin films to compute your instant taste profile.
        </p>
        
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={onRedraw}
            className="btn-secondary text-xs !padding-x-3 !padding-y-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Draw New Pool</span>
          </button>
          <span className="text-xs text-slate-400">
            Guaranteed 1+ each of ROM, SCI, FAN, SUS
          </span>
        </div>
      </div>

      {/* Poster Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {pool.map(movie => (
          <PosterTile
            key={movie.id}
            movie={movie}
            isSelected={selectedIds.includes(movie.id)}
            onToggle={onToggle}
          />
        ))}
      </div>

      {/* Floating Sticky Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4">
        <div className="glass-panel glass-blur p-4 px-6 flex items-center justify-between gap-4 glow-border shadow-2xl bg-slate-950/90">
          <div>
            <div className="text-sm font-bold text-white">
              {selectedIds.length} of {pool.length} liked
            </div>
            <div className="text-xs text-slate-400">
              {pool.length - selectedIds.length} registered as disliked
            </div>
          </div>

          <button
            onClick={onSubmit}
            className="btn-primary animate-pulse-glow !text-base !px-8 !py-3.5"
          >
            <span>Get Instant Recs</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
