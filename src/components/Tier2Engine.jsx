import React, { useState } from 'react';
import { getNearTwinMatchups } from '../utils/engine';
import { Sparkles, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Tier2Engine({ onComplete }) {
  const matchups = getNearTwinMatchups();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQ = matchups[currentIndex];
  const progress = Math.round(((currentIndex) / matchups.length) * 100);

  const handleSelect = (choice) => {
    const updated = { ...answers, [currentQ.id]: choice };
    setAnswers(updated);

    if (currentIndex < matchups.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(updated);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pb-24 animate-fade-in">
      {/* Progress Bar Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tier 2 — Crafted Near-Twin Calibration (Gate G1)</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 max-w-md mx-auto mb-2">
          <span>Question {currentIndex + 1} of {matchups.length}</span>
          <span>{progress}% Completed</span>
        </div>
        <div className="w-full max-w-md mx-auto h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / matchups.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-8 sm:p-12 mb-8 border-white/10 relative overflow-hidden shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-title">
            {currentQ.title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {currentQ.premise}
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A */}
          <div
            onClick={() => handleSelect('A')}
            className={`glass-panel p-6 sm:p-8 cursor-pointer border transition-all duration-300 flex flex-col justify-between group ${
              answers[currentQ.id] === 'A'
                ? 'border-cyan-400 bg-cyan-950/40 scale-[1.02] shadow-xl shadow-cyan-500/20'
                : 'border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
                Execution Style A
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-title group-hover:text-cyan-300 transition-colors">
                {currentQ.optionA.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                "{currentQ.optionA.desc}"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-300">
              <span>Select this execution</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Option B */}
          <div
            onClick={() => handleSelect('B')}
            className={`glass-panel p-6 sm:p-8 cursor-pointer border transition-all duration-300 flex flex-col justify-between group ${
              answers[currentQ.id] === 'B'
                ? 'border-pink-400 bg-pink-950/40 scale-[1.02] shadow-xl shadow-pink-500/20'
                : 'border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">
                Execution Style B
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-title group-hover:text-pink-300 transition-colors">
                {currentQ.optionB.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                "{currentQ.optionB.desc}"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-pink-300">
              <span>Select this execution</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Both / Neither neutral actions */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs">
          <button
            onClick={() => handleSelect('Both')}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            I appreciate both equally
          </button>
          <button
            onClick={() => handleSelect('Neither')}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
          >
            Neither resonates with me
          </button>
        </div>
      </div>
    </div>
  );
}
