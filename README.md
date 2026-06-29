# Movie Taste Lab — Cloudflare Pages deploy

Static Vite + React + Tailwind single-page app. This folder is the **deploy source** for
Cloudflare Pages (git-connected build). No backend/worker, no API keys required — the
"why this fits you" text is produced by a client-side templated engine fallback.

## Cloudflare Pages settings

| Setting | Value |
|---|---|
| Framework preset | Vite (or None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variables | none required |

Cloudflare runs `npm install` then `npm run build`, and serves the generated `dist/`.
Every push to the connected branch auto-rebuilds and redeploys.

## Local dev

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # outputs dist/
npm run preview  # serve the built dist/
```

## Optional: live LLM explanations (future)

Not deployed here. To enable real model-generated text instead of the client-side fallback,
deploy the separate Cloudflare Worker (in the original repo's `worker/`) and set
`OPENROUTER_API_KEY` as a Worker secret. Until then the app works fully offline-capable.

## Access control (pre-production)

This site is gated behind **Cloudflare Access** (Zero Trust) while not public — visitors must
authenticate (email one-time PIN) before the `*.pages.dev` URL loads. Remove the Access
application when ready to go public.
