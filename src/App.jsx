import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Tier1Landing from './components/Tier1Landing';
import InstantRecs from './components/InstantRecs';
import Tier2Engine from './components/Tier2Engine';
import CraftedRecs from './components/CraftedRecs';
import InspectModelModal from './components/InspectModelModal';
import { drawTier1Pool, computeTier1Profile, getRecommendations, updateProfileWithTier2 } from './utils/engine';

export default function App() {
  const [step, setStep] = useState('landing'); // 'landing' | 'instant' | 'tier2' | 'crafted'
  const [pool, setPool] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [profile, setProfile] = useState(null);
  const [recs, setRecs] = useState([]);
  const [showInspect, setShowInspect] = useState(false);

  // Initialize pool on mount
  useEffect(() => {
    handleRedraw();
  }, []);

  const handleRedraw = () => {
    const newPool = drawTier1Pool();
    setPool(newPool);
    setSelectedIds([]);
  };

  const handleToggleLike = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmitTier1 = () => {
    const computedProfile = computeTier1Profile(selectedIds, pool);
    setProfile(computedProfile);
    
    // Compute offline recommendations excluding drawn tiles
    const poolIds = pool.map(m => m.id);
    const instantRecs = getRecommendations(computedProfile, poolIds, 4);
    setRecs(instantRecs);
    
    // Log Gate G3 compliant inspectable profile to console
    console.info("🔬 [Gate G3] Inspectable Taste Profile Derived (Tier 1):", computedProfile);

    setStep('instant');
  };

  const handleStartTier2 = () => {
    setStep('tier2');
  };

  const handleCompleteTier2 = (answers) => {
    const updatedProfile = updateProfileWithTier2(profile, answers);
    setProfile(updatedProfile);

    // Recompute sharper recommendations excluding drawn tiles
    const poolIds = pool.map(m => m.id);
    const craftedRecs = getRecommendations(updatedProfile, poolIds, 4);
    setRecs(craftedRecs);

    console.info("🔬 [Gate G3] Inspectable Taste Profile Refined (Tier 2):", updatedProfile);

    setStep('crafted');
  };

  const handleReset = () => {
    handleRedraw();
    setStep('landing');
    setProfile(null);
    setRecs([]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header
          currentTier={step === 'landing' || step === 'instant' ? 1 : 2}
          onOpenInspect={() => setShowInspect(true)}
          onReset={handleReset}
        />

        <main>
          {step === 'landing' && (
            <Tier1Landing
              pool={pool}
              selectedIds={selectedIds}
              onToggle={handleToggleLike}
              onSubmit={handleSubmitTier1}
              onRedraw={handleRedraw}
            />
          )}

          {step === 'instant' && profile && (
            <InstantRecs
              recs={recs}
              profile={profile}
              onStartTier2={handleStartTier2}
              onReset={handleReset}
            />
          )}

          {step === 'tier2' && (
            <Tier2Engine onComplete={handleCompleteTier2} />
          )}

          {step === 'crafted' && profile && (
            <CraftedRecs
              recs={recs}
              profile={profile}
              onReset={handleReset}
              onOpenInspect={() => setShowInspect(true)}
            />
          )}
        </main>
      </div>

      <footer className="text-center py-6 text-xs text-slate-500 border-t border-white/5 mt-16">
        <p>Movie Taste Lab — Single-User Cinematic Recommender. Built autonomously by Gemini 3.1 Pro via agy.</p>
      </footer>

      {showInspect && profile && (
        <InspectModelModal
          profile={profile}
          onClose={() => setShowInspect(false)}
        />
      )}
    </div>
  );
}
