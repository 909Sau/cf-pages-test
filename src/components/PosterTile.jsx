import React, { useState } from 'react';
import { Check, Heart, X } from 'lucide-react';

const GENRE_COLORS = {
  ROM: 'from-rose-600 via-pink-700 to-purple-900 border-rose-500/30 text-rose-300',
  SCI: 'from-cyan-600 via-blue-800 to-slate-900 border-cyan-500/30 text-cyan-300',
  FAN: 'from-amber-500 via-purple-700 to-indigo-950 border-amber-500/30 text-amber-300',
  SUS: 'from-emerald-700 via-teal-900 to-slate-950 border-emerald-500/30 text-emerald-300'
};

export default function PosterTile({ movie, isSelected, onToggle }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onToggle(movie.id)}
      className={`poster-tile relative aspect-[2/3] rounded-2xl overflow-hidden glass-panel flex flex-col justify-end select-none transition-all duration-300 ${
        isSelected ? 'selected scale-[1.02] shadow-2xl shadow-cyan-500/20' : 'opacity-85 hover:opacity-100'
      }`}
    >
      {/* Background Image or Fallback Styled Gradient */}
      {!imgError && movie.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${GENRE_COLORS[movie.genre] || GENRE_COLORS.SCI} p-6 flex flex-col justify-between`}>
          <span className="text-xs font-bold tracking-widest uppercase py-1 px-3 rounded-full bg-black/40 self-start border border-white/10">
            {movie.genre}
          </span>
          <div>
            <h3 className="text-xl font-bold leading-tight text-white mb-2 font-title drop-shadow-md">
              {movie.title}
            </h3>
            <p className="text-xs text-white/80 italic drop-shadow line-clamp-3">
              "{movie.tagline}"
            </p>
          </div>
        </div>
      )}

      {/* Dark gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-bold tracking-widest uppercase py-1 px-2.5 rounded-full bg-black/80 border border-white/10 text-white/90">
          {movie.genre} · {movie.year}
        </span>

        {/* Like / Dislike Indicator Badge */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isSelected 
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black scale-110 shadow-lg shadow-cyan-400/50' 
            : 'bg-black/60 text-white/50 border border-white/20'
        }`}>
          {isSelected ? <Check className="w-5 h-5 stroke-[3]" /> : <X className="w-4 h-4 opacity-40" />}
        </div>
      </div>

      {/* Bottom Title & Tagline info */}
      <div className="relative z-10 p-4 pt-8 pointer-events-none">
        <h3 className="text-base font-bold text-white leading-snug drop-shadow-md font-title">
          {movie.title}
        </h3>
        <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
          {movie.tagline}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-[11px]">
          <span className={isSelected ? 'text-cyan-300 font-semibold flex items-center gap-1' : 'text-slate-400'}>
            {isSelected ? '★ LIKED (Tapped)' : '○ DISLIKED (Untapped)'}
          </span>
        </div>
      </div>
    </div>
  );
}
