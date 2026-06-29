import React, { useEffect, useState } from 'react';
import { generateWhyItFits } from '../services/llmService';
import { Sparkles, RefreshCw, Sliders, CheckCircle2, MessageSquareQuote } from 'lucide-react';

export default function CraftedRecs({ recs, profile, onReset, onOpenInspect }) {
  const [explanations, setExplanations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadExplanations() {
      setLoading(true);
      const results = {};
      for (const movie of recs) {
        results[movie.id] = await generateWhyItFits(movie, profile);
      }
      if (isMounted) {
        setExplanations(results);
        setLoading(false);
      }
    }
    loadExplanations();
    return () => { isMounted = false; };
  }, [recs, profile]);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 animate-fade-in">
      {/* Banner */}
      <div className="glass-panel p-8 mb-12 border-pink-500/30 bg-gradient-to-r from-pink-950/40 via-purple-900/40 to-cyan-950/40 text-center relative overflow-hidden shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tier 2 Crafted Engine Complete</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 font-title">
          Sharper Recommendations & Explanations
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto mb-6">
          Calibrated using your explicit axis weights (Gate G3) and contract delivery term (Gate G2). Each match includes a personalized explanation of why its execution fits your taste delta.
        </p>
        
        <button
          onClick={onOpenInspect}
          className="btn-secondary !text-xs !bg-white/10 hover:!bg-white/20 border-white/20 text-white"
        >
          <Sliders className="w-3.5 h-3.5 text-pink-400" />
          <span>Inspect Model Weights (Gate G3)</span>
        </button>
      </div>

      {/* Recs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {recs.map((movie) => (
          <div key={movie.id} className="glass-panel overflow-hidden flex flex-col sm:flex-row border-white/10 hover:border-pink-500/40 transition-all duration-300 group shadow-xl">
            {/* Poster column */}
            <div className="sm:w-2/5 relative aspect-[16/9] sm:aspect-auto bg-slate-900 overflow-hidden min-h-[220px]">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-950 p-6 flex items-center justify-center text-center">
                  <span className="font-title font-bold text-xl text-white">{movie.title}</span>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/80 text-white border border-white/10 font-title text-[11px] font-bold px-2.5 py-1 rounded-full">
                {movie.genre} · {movie.year}
              </div>
              <div className="absolute bottom-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold font-title text-xs px-3 py-1 rounded-full shadow-lg">
                {movie.matchPercentage}% MATCH
              </div>
            </div>

            {/* Content column */}
            <div className="sm:w-3/5 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white leading-snug font-title mb-1">
                  {movie.title}
                </h3>
                <p className="text-xs text-slate-400 italic mb-4">
                  "{movie.tagline}"
                </p>

                {/* "Why this fits you" box */}
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 relative mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 mb-1.5">
                    <MessageSquareQuote className="w-4 h-4" />
                    <span>Why this fits your taste profile:</span>
                  </div>
                  {loading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-full" />
                    </div>
                  ) : (
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {explanations[movie.id]}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Contract: <strong className="text-slate-300">{movie.promise.contract}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Start Over CTA */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="btn-primary !px-8 !py-3.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Start New Taste Session</span>
        </button>
      </div>
    </div>
  );
}
