import React from 'react';
import { X, Copy, Check, Sliders, ShieldCheck } from 'lucide-react';

const AXIS_LABELS = {
  pacing: { name: 'Pacing & Rhythm', neg: 'Methodical / Slow-burn (-1.0)', pos: 'Kinetic / Relentless (+1.0)' },
  tone: { name: 'Emotional Tone', neg: 'Dark / Gritty / Cynical (-1.0)', pos: 'Bright / Optimistic / Fun (+1.0)' },
  visualScale: { name: 'Visual Scale', neg: 'Intimate / Grounded (-1.0)', pos: 'Grand / Cosmic Spectacle (+1.0)' },
  spectacleSincerity: { name: 'Sincerity vs. Irony', neg: 'Meta / Self-Aware / Camp (-1.0)', pos: 'Earnest / Mythic Sincerity (+1.0)' },
  riskTolerance: { name: 'Artistic Risk', neg: 'Conventional Formula (-1.0)', pos: 'Experimental / Subversive (+1.0)' }
};

export default function InspectModelModal({ profile, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!profile) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 border-cyan-500/40 shadow-2xl relative bg-slate-950/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-title flex items-center gap-2">
                Inspectable Taste Model
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-normal flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Gate G3 Compliant
                </span>
              </h3>
              <p className="text-xs text-slate-400">Readable explicit per-axis weights derived from delta calibration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 bg-white/[0.02] p-4 rounded-xl border border-white/5 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Calibration Stage</span>
            <strong className="text-white font-semibold">Tier {profile.tier} ({profile.tier === 1 ? 'Instant Front Door' : 'Crafted Engine'})</strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Contract Sensitivity (G2)</span>
            <strong className="text-cyan-300 font-semibold">{profile.contractSensitivity} / 1.00</strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Last Updated</span>
            <strong className="text-slate-300 font-mono">{new Date(profile.timestamp).toLocaleTimeString()}</strong>
          </div>
        </div>

        {/* Explicit Axis Weights */}
        <div className="space-y-6 mb-8">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-title">
            Per-Axis Delta Weights (-1.00 to +1.00)
          </h4>

          {Object.entries(profile.axes).map(([key, value]) => {
            const info = AXIS_LABELS[key] || { name: key, neg: '-1', pos: '+1' };
            // normalize -1..1 to 0..100% for bar representation
            const percentage = ((value + 1) / 2) * 100;

            return (
              <div key={key} className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white font-title">{info.name}</span>
                  <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
                    value > 0 ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' :
                    value < 0 ? 'bg-pink-500/10 text-pink-300 border border-pink-500/20' :
                    'bg-slate-500/10 text-slate-300'
                  }`}>
                    {value > 0 ? `+${value}` : value}
                  </span>
                </div>

                <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30 z-10" />
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{info.neg}</span>
                  <span>{info.pos}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* JSON Export Panel */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Raw JSON Profile Data</span>
            <button
              onClick={handleCopy}
              className="btn-secondary !padding-x-3 !padding-y-1 !text-xs !bg-white/5 hover:!bg-white/10 text-slate-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="bg-slate-900 p-4 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-white/5 max-h-48">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
