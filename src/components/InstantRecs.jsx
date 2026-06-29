import React, { useState } from 'react';
import { Sparkles, ArrowRight, RefreshCw, Sliders, CheckCircle } from 'lucide-react';

export default function InstantRecs({ recs, profile, onStartTier2, onReset }) {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 animate-fade-in">
      {/* Banner */}
      <div className="glass-panel p-8 mb-12 border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-purple-950/40 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Tier 1 Precomputed Mapping Complete</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 font-title">
          Your Instant Recommendations
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto">
          Generated offline in 0ms from your like/dislike delta split across Pacing ({profile.axes.pacing}), Tone ({profile.axes.tone}), and Scale ({profile.axes.visualScale}).
        </p>
      </div>

      {/* Recs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {recs.map((movie, index) => (
          <div key={movie.id} className="glass-panel overflow-hidden flex flex-col justify-between border-white/10 hover:border-cyan-500/40 transition-all duration-300 group">
            <div className="relative aspect-[16/9] sm:aspect-[2/3] bg-slate-900 overflow-hidden">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 p-4 flex items-center justify-center text-center">
                  <span className="font-title font-bold text-lg text-white">{movie.title}</span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold font-title text-xs px-3 py-1 rounded-full shadow-lg">
                {movie.matchPercentage}% MATCH
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="text-cyan-400 font-semibold">{movie.genre} · {movie.year}</span>
                  <span>Match Score: {movie.matchScore}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug font-title mb-2">
                  {movie.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mb-4">
                  {movie.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 bg-white/[0.02] -mx-5 -mb-5 p-3 px-5 flex items-center justify-between">
                <span>Contract: <strong className="text-slate-200">{movie.promise.deliveryScore * 100}% delivery</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tier 2 Opt-in Call to Action (Gate G1 & G3 progression) */}
      <div className="glass-panel p-8 sm:p-12 glow-border max-w-4xl mx-auto text-center bg-gradient-to-b from-slate-900/90 to-purple-950/60 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 font-title">
          Want a more detailed, crafted recommendation?
        </h3>
        <p className="text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Step into <strong className="text-white">Tier 2</strong>. We will run 4 short <span className="text-cyan-300 font-semibold">Near-Twin Matchup</span> questions to isolate your preference between films with identical premises but opposite execution. You'll get sharper matches and tailored <span className="text-pink-300 font-semibold">"why this fits you"</span> explanations.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartTier2}
            className="btn-primary !px-8 !py-4 !text-base shadow-xl shadow-pink-500/30"
          >
            <span>Start Tier-2 Crafted Engine</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onReset}
            className="btn-secondary !px-6 !py-4"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Start Over (Tier 1)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
