import { MOVIES } from '../data/movies';

/**
 * Draws 7-8 random movies guaranteeing at least 1 from each genre (ROM, SCI, FAN, SUS).
 */
export function drawTier1Pool() {
  const genres = ['ROM', 'SCI', 'FAN', 'SUS'];
  const pool = [];
  const selectedIds = new Set();

  // 1. Pick at least one random from each genre
  genres.forEach(g => {
    const genreMovies = MOVIES.filter(m => m.genre === g);
    const randomMovie = genreMovies[Math.floor(Math.random() * genreMovies.length)];
    if (randomMovie && !selectedIds.has(randomMovie.id)) {
      pool.push(randomMovie);
      selectedIds.add(randomMovie.id);
    }
  });

  // 2. Fill up to 8 total movies randomly from the remaining catalog
  const remaining = MOVIES.filter(m => !selectedIds.has(m.id));
  const shuffled = [...remaining].sort(() => 0.5 - Math.random());
  
  const targetSize = Math.random() > 0.5 ? 8 : 7;
  while (pool.length < targetSize && shuffled.length > 0) {
    const nextMovie = shuffled.pop();
    pool.push(nextMovie);
    selectedIds.add(nextMovie.id);
  }

  // Shuffle the resulting pool so genres are distributed randomly on the screen
  return pool.sort(() => 0.5 - Math.random());
}

/**
 * Computes baseline taste profile from Tier 1 liked/disliked tiles.
 */
export function computeTier1Profile(likedIds, displayedMovies) {
  const axes = { pacing: 0, tone: 0, visualScale: 0, spectacleSincerity: 0, riskTolerance: 0 };
  let contractSensitivity = 0.5;

  const likedSet = new Set(likedIds);
  let likedCount = 0;
  let dislikedCount = 0;

  displayedMovies.forEach(movie => {
    const isLiked = likedSet.has(movie.id);
    const weight = isLiked ? 1.0 : -0.7; // Untapped counts as disliked delta
    
    if (isLiked) likedCount++;
    else dislikedCount++;

    axes.pacing += movie.axes.pacing * weight;
    axes.tone += movie.axes.tone * weight;
    axes.visualScale += movie.axes.visualScale * weight;
    axes.spectacleSincerity += movie.axes.spectacleSincerity * weight;
    axes.riskTolerance += movie.axes.riskTolerance * weight;
  });

  const total = Math.max(1, likedCount + dislikedCount);
  Object.keys(axes).forEach(k => {
    axes[k] = Number((axes[k] / total).toFixed(2));
  });

  // Calculate if user appreciates high delivery contract over pure genre match
  if (likedCount > 0) {
    const avgDeliveryLiked = displayedMovies
      .filter(m => likedSet.has(m.id))
      .reduce((acc, m) => acc + m.promise.deliveryScore, 0) / likedCount;
    contractSensitivity = Number(((avgDeliveryLiked - 0.75) * 4).toFixed(2));
    contractSensitivity = Math.max(0.1, Math.min(1.0, contractSensitivity));
  }

  return {
    axes,
    contractSensitivity,
    tier: 1,
    timestamp: new Date().toISOString()
  };
}

/**
 * Scores and returns top recommendations based on taste profile.
 * Implements Gate G2 (Expectation/Contract term so comedy/animation isn't mispredicted).
 */
export function getRecommendations(userProfile, excludeIds = [], count = 4) {
  const excludeSet = new Set(excludeIds);
  const eligible = MOVIES.filter(m => !excludeSet.has(m.id));

  const scored = eligible.map(movie => {
    // Calculate cosine-like dot product match across axes
    let axisMatch = 0;
    const { axes } = userProfile;
    axisMatch += (axes.pacing * movie.axes.pacing);
    axisMatch += (axes.tone * movie.axes.tone);
    axisMatch += (axes.visualScale * movie.axes.visualScale);
    axisMatch += (axes.spectacleSincerity * movie.axes.spectacleSincerity);
    axisMatch += (axes.riskTolerance * movie.axes.riskTolerance);

    // Normalize match slightly
    axisMatch = (axisMatch / 5) + 0.5; // shift around positive range

    // Gate G2: Expectation/Contract Delivery Modifier
    // Rewarding films that over-deliver on their contract promise regardless of genre absolute distance
    const deliveryBonus = (movie.promise.deliveryScore - 0.80) * (userProfile.contractSensitivity || 0.5) * 1.5;
    
    const finalScore = Number((axisMatch + deliveryBonus).toFixed(3));

    return {
      ...movie,
      matchScore: finalScore,
      matchPercentage: Math.min(99, Math.max(65, Math.round(finalScore * 85 + 20)))
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, count);
}

/**
 * Returns Tier 2 Near-Twin Matchup questions (Gate G1).
 */
export function getNearTwinMatchups() {
  return [
    {
      id: 'q1_sci',
      title: 'Sci-Fi Execution Delta',
      premise: 'Both are visionary sci-fi masterworks exploring human limits, but with opposite emotional engines.',
      optionA: {
        title: 'Interstellar / Dune 2',
        desc: 'Earnest, mythic grandeur, deeply emotional human stakes, cosmic sweep.',
        delta: { pacing: -0.2, tone: -0.3, visualScale: 0.9, spectacleSincerity: 0.9, riskTolerance: 0.3 }
      },
      optionB: {
        title: 'Inception / Spider-Verse',
        desc: 'Kinetic, clockwork puzzle momentum, sleek multi-layered subversive coolness.',
        delta: { pacing: 0.8, tone: 0.2, visualScale: 0.7, spectacleSincerity: 0.4, riskTolerance: 0.8 }
      }
    },
    {
      id: 'q2_tone',
      title: 'Action & Tone Contract',
      premise: 'When watching high-budget spectacle, what implicit contract do you value most?',
      optionA: {
        title: 'Logan / The Dark Knight / Oppenheimer',
        desc: 'Gritty gravity, dramatic weight, severe consequences, dark realism.',
        delta: { pacing: -0.1, tone: -0.9, visualScale: 0.5, spectacleSincerity: 0.8, riskTolerance: 0.5 }
      },
      optionB: {
        title: 'Deadpool & Wolverine / Guardians 3 / Barbie',
        desc: 'Irreverent meta-wit, vibrant colorful fun, self-aware entertainment promise.',
        delta: { pacing: 0.8, tone: 0.8, visualScale: 0.8, spectacleSincerity: -0.6, riskTolerance: 0.3 }
      }
    },
    {
      id: 'q3_pacing',
      title: 'Suspense & Horror Rhythm',
      premise: 'Both keep you on the edge of your seat, but through vastly different pacing mechanisms.',
      optionA: {
        title: 'A Quiet Place: Day One / Sinners',
        desc: 'Atmospheric slow-burn tension, intimate character focus, dread-building.',
        delta: { pacing: -0.6, tone: -0.8, visualScale: -0.2, spectacleSincerity: 0.7, riskTolerance: 0.4 }
      },
      optionB: {
        title: 'Alien: Romulus / Mission: Impossible',
        desc: 'Relentless kinetic momentum, visceral set-pieces, non-stop adrenaline.',
        delta: { pacing: 0.9, tone: -0.4, visualScale: 0.6, spectacleSincerity: 0.5, riskTolerance: -0.2 }
      }
    },
    {
      id: 'q4_sincerity',
      title: 'Escapism vs. Artistic Risk',
      premise: 'When choosing a weekend film, where does your comfort zone lie?',
      optionA: {
        title: 'Wicked / Wonka / Super Mario',
        desc: 'Uncynical warmth, crowd-pleasing comfort, faithful theatrical execution.',
        delta: { pacing: 0.4, tone: 0.7, visualScale: 0.7, spectacleSincerity: 0.9, riskTolerance: -0.6 }
      },
      optionB: {
        title: 'Wuthering Heights / Backrooms / Poor Things style',
        desc: 'Subversive artistic swings, unconventional choices, challenging boundaries.',
        delta: { pacing: -0.4, tone: -0.7, visualScale: 0.2, spectacleSincerity: 0.5, riskTolerance: 0.9 }
      }
    }
  ];
}

/**
 * Updates profile with Tier 2 matchup answers (Gate G3).
 */
export function updateProfileWithTier2(baseProfile, answers) {
  const newAxes = { ...baseProfile.axes };
  const matchups = getNearTwinMatchups();

  Object.entries(answers).forEach(([qId, choice]) => {
    const matchup = matchups.find(m => m.id === qId);
    if (!matchup) return;

    let delta = null;
    if (choice === 'A') delta = matchup.optionA.delta;
    if (choice === 'B') delta = matchup.optionB.delta;

    if (delta) {
      Object.keys(newAxes).forEach(key => {
        newAxes[key] = Number(((newAxes[key] * 0.6) + (delta[key] * 0.4)).toFixed(2));
      });
    }
  });

  return {
    ...baseProfile,
    axes: newAxes,
    tier: 2,
    timestamp: new Date().toISOString()
  };
}
