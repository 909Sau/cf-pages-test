/**
 * Service for generating "why this fits you" explanations.
 * Attempts runtime LLM if API key or Worker endpoint is available,
 * otherwise falls back seamlessly to intelligent templated explanations based on inspectable taste weights.
 */
export async function generateWhyItFits(movie, userProfile) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  // Try calling runtime OpenRouter LLM if API key is provided
  if (apiKey && apiKey !== "placeholder_openrouter_api_key_here") {
    try {
      const prompt = `You are a cinematic taste expert. Explain in exactly 2 short, engaging sentences why the movie "${movie.title}" fits a user with this specific taste delta profile:
Pacing weight: ${userProfile.axes.pacing} (-1 slow-burn to +1 kinetic)
Tone weight: ${userProfile.axes.tone} (-1 dark/gritty to +1 bright/fun)
Visual Scale: ${userProfile.axes.visualScale} (-1 intimate to +1 grand epic)
Sincerity: ${userProfile.axes.spectacleSincerity} (-1 ironic/meta to +1 earnest/mythic)
Risk Tolerance: ${userProfile.axes.riskTolerance} (-1 conventional to +1 experimental)
Movie promise contract delivery: ${movie.promise.deliveryScore * 100}% (${movie.promise.contract}).
Do not mention numerical weights directly; explain naturally how the film's execution matches their taste preference.`;

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-pro-1.5",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 120
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text.trim();
      }
    } catch (err) {
      console.warn("Runtime LLM call failed or timed out, using fallback templated engine:", err);
    }
  }

  // Intelligent Client-Side Templated Explanation Engine (Fallback / Offline)
  const { axes, contractSensitivity } = userProfile;
  const traits = [];

  if (axes.pacing > 0.3) traits.push("kinetic, relentless momentum");
  else if (axes.pacing < -0.3) traits.push("methodical, atmospheric slow-burn tension");

  if (axes.tone > 0.3) traits.push("vibrant, optimistic energy");
  else if (axes.tone < -0.3) traits.push("dark, gritty gravity");

  if (axes.visualScale > 0.3) traits.push("grand, sweeping visual spectacle");
  else if (axes.visualScale < -0.3) traits.push("grounded, intimate character focus");

  if (axes.spectacleSincerity > 0.3) traits.push("earnest, mythic storytelling");
  else if (axes.spectacleSincerity < -0.3) traits.push("clever self-awareness and wit");

  const topTraitsStr = traits.slice(0, 2).join(" combined with ") || "balanced cinematic craftsmanship";
  
  const contractNote = movie.promise.deliveryScore >= 0.88
    ? `Crucially, it over-delivers on its promise of ${movie.promise.contract.toLowerCase()}, rewarding your high standard for execution.`
    : `It delivers solidly on its promise of ${movie.promise.contract.toLowerCase()}, aligning with your taste preferences.`;

  return `Because your profile favors ${topTraitsStr}, "${movie.title}" fits your taste delta perfectly. ${contractNote}`;
}
