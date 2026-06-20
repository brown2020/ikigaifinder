# AGENTS.md

Authoritative operating guide for autonomous coding agents (Codex, Claude, etc.) working in this repository. Read this file in full before making any change. For product scope and roadmap, read [`spec.md`](./spec.md).

---

## Project overview

**Ikigai Finder AI** is a Next.js 16 web application that helps people discover their _ikigai_ (生き甲斐, "a reason for being") through an AI-guided questionnaire. It generates personalized ikigai statements with compatibility scores, lets users create an AI-generated cover image, and produces a shareable card.

## Product purpose

Turn a short, structured self-reflection survey into a small set of concrete, personalized ikigai statements (each scored across Passion, Profession, Vocation, Mission, and overall compatibility), then let the user pick one, illustrate it, and share it. See [`spec.md`](./spec.md) for the full product definition.

## Current tech stack

- **Framework:** Next.js 16 (App Router) — `next` `^16.2.7`
- **Language:** TypeScript `^6.x` (strict), React `19.2`
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`), utility-first, no CSS-in-JS
- **State:** Zustand 5 (with `devtools`)
- **Auth + data:** Firebase Web SDK 12 (client) + Firebase Admin 13 (server)
- **AI text:** Vercel AI SDK (`ai` v6) + `@ai-sdk/openai` (GPT‑4o), streamed to the client via `@ai-sdk/rsc` (`createStreamableValue` / `readStreamableValue`)
- **AI images:** Fireworks AI REST API — Stable Diffusion XL 1024 v1.0 (`fetch`-based, no SDK)
- **Forms:** React Hook Form 7 + Zod 4
- **Lint:** ESLint 10 + `eslint-config-next`
- **Package manager:** **npm** (lockfile: `package-lock.json`). Do not switch package managers.

## Repository structure

```
src/
├── proxy.ts                  # Next.js 16 route protection (Node runtime, verifies session cookie)
├── app/                      # App Router pages + API routes
│   ├── api/
│   │   ├── auth/session/     # POST creates session cookie, DELETE clears it
│   │   ├── downloadImage/    # GET image proxy (CORS) for downloads
│   │   └── ikigai/sharing/   # PATCH toggle public sharing (admin SDK)
│   ├── ikigai-finder/        # Questionnaire entry (protected)
│   ├── generate-ikigai/      # Generate statements + cover image (protected)
│   ├── ikigai/[id]/          # Public shareable ikigai page
│   ├── dashboard/ profile/   # Authenticated user areas (each has loading.tsx/error.tsx)
│   └── (marketing/legal)/    # home, about, support, privacy-policy, terms-conditions
├── components/               # Feature + layout components
│   ├── ui/                   # Primitives (Button, Card, Input, Skeleton, …)
│   ├── auth/                 # AuthModal, AuthForm, SocialLogin, SignedInView
│   └── icons/
├── lib/
│   ├── generateIkigai.ts     # SERVER ACTION: GPT-4o ikigai generation (rate-limited, validated)
│   ├── generateImage.ts      # SERVER ACTION: Fireworks SDXL → Firebase Storage → signed URL
│   ├── rateLimit.ts          # In-memory rate limiter (NOT distributed)
│   ├── validation.ts         # Zod schemas + sanitizeInput()
│   ├── errors.ts             # Custom error classes
│   └── auth/                 # session cookie helpers (server + client)
├── services/                 # Firestore data layer (ikigaiService, profileService, userService)
├── hooks/                    # use-auth-actions, use-auth-token, use-ikigai-generator
├── zustand/                  # useAuthStore, useIkigaiStore, useProfileStore, useUIStore
├── constants/                # questions.ts (survey), systemPrompt.ts, menuItems.ts
├── utils/                    # ikigaiParser, downloadImage, canvasUtils, resizeImage, baseUrl, …
├── firebase/                 # firebaseClient.ts, firebaseAdmin.ts
└── types/                    # Centralized TypeScript types (index.ts)

firestore.rules               # Owner-based access; public read of /ikigai/main when sharable
storage.rules                 # User-scoped paths; deny by default
env.sample                    # Required environment variables (copy to .env.local)
```

## Core architecture overview

- **App Router + RSC.** Pages default to Server Components; interactive UI is split into `_components/*-page.tsx` client components.
- **AI text generation** runs as a Next.js **server action** (`src/lib/generateIkigai.ts`). It streams tokens with `@ai-sdk/rsc`; the client consumes them in `src/hooks/use-ikigai-generator.ts` and parses free-text into structured `IkigaiData[]` via `src/utils/ikigaiParser.ts` (regex-based).
- **AI image generation** is a server action (`src/lib/generateImage.ts`) that calls the Fireworks REST API, uploads the result to Firebase Storage with the Admin SDK, and returns a long-lived signed URL.
- **Auth flow:** client signs in with the Firebase Web SDK → obtains an ID token → `POST /api/auth/session` verifies it and sets an **httpOnly session cookie** via `adminAuth.createSessionCookie`. `src/proxy.ts` verifies that cookie (with revocation check) for protected route segments only.
- **Data access is mixed:** most reads/writes use the **client** Firebase SDK from `src/services/*` (guarded by `firestore.rules`); a few server paths (`/api/ikigai/sharing`, the public share page) use the **Admin SDK**.
- **State:** four small Zustand stores; UID is re-checked after async work to avoid cross-user race conditions.

## Key app features that exist today

- Email/password, Google, and email-link ("magic link") sign-in (Firebase Auth).
- Multi-step ikigai questionnaire (`src/constants/questions.ts`).
- Streaming GPT‑4o generation of ~10 ikigai statements, each with compatibility scores.
- Selection of a preferred statement, persisted per user in Firestore.
- AI cover-image generation (Fireworks SDXL) stored in Firebase Storage, with a cover history.
- Public sharing toggle + public `/ikigai/[id]` page + social share buttons + downloadable card (`html2canvas`).
- Dashboard and editable profile.
- Security headers/CSP (`next.config.mjs`), input sanitization, rate limiting, cookie-consent banner.

## Important commands

```bash
npm install        # install deps (uses package-lock.json)
npm run dev        # local dev server (DO NOT run in autonomous validation — long-running)
npm run build      # production build; runs TypeScript type-checking
npm run start      # serve a production build
npm run lint       # ESLint
npm test           # Vitest one-shot runner (currently proxy + parser coverage)
npx tsc --noEmit   # standalone type-check (no dedicated npm script exists)
```

## Canonical validation/check command

Vitest is wired as a one-shot runner via `npm test` and currently covers `src/proxy.ts` plus the ikigai parser. The canonical, non-interactive regression check is:

```bash
npm run lint && npm run build
```

`npm run build` performs full TypeScript type-checking, so a green build is the type-check gate. Run `npx tsc --noEmit` for a faster type-only pass while iterating. A change is not "done" until `npm run lint && npm run build` both pass.

## Non-interactive testing rules

- Never start watch mode, dev servers, or anything that blocks (`npm run dev`, `next dev`, `--watch`).
- Never launch a headed browser or anything requiring manual login.
- Use CI-safe, one-shot commands only; assume no human is available to answer prompts.
- If a check cannot run (e.g. missing secrets for runtime behavior), state that explicitly rather than faking it. Build and lint do **not** require real API keys.

## Development conventions

- TypeScript everywhere; functional components and hooks only (no classes for UI).
- Prefer Server Components; add `"use client"` only when interactivity/browser APIs are required.
- Import via the `@/` path alias (`@/components/...`, `@/lib/...`).
- Centralize shared types in `src/types/index.ts`; validate external/user input with Zod (`src/lib/validation.ts`) and sanitize with `sanitizeInput()` before sending to AI.
- Use atomic Zustand selectors. Keep stores small and focused.
- Match existing file naming: components `PascalCase.tsx`, hooks `use-kebab-case.ts`, route client wrappers under `app/<route>/_components/<route>-page.tsx`.
- Do not add narrating comments; comment only non-obvious intent.

## TypeScript and lint expectations

- Code must type-check (`npm run build` / `npx tsc --noEmit`) with no new errors.
- ESLint must pass (`npm run lint`). Do not add blanket disables; fix the underlying issue or scope a disable narrowly with justification.
- No `any` unless unavoidable and justified; prefer the existing centralized types.

## Server/client boundary guidance

- Server actions live in `src/lib/*` and start with `"use server"`. They are the only place secrets (`OPENAI_API_KEY`, `FIREWORKS_API_KEY`, Firebase Admin creds) may be read.
- Never import `src/firebase/firebaseAdmin.ts`, server actions' internals, or any secret into a `"use client"` module.
- Only `NEXT_PUBLIC_*` env vars may be referenced in client code. Everything else is server-only.
- The client consumes AI output via streamable values from server actions — keep that contract intact when editing generation code.

## Route-protection guidance

- Route protection is centralized in `src/proxy.ts` (Next.js 16 proxy, Node runtime). Protected segments: `/dashboard`, `/generate-ikigai`, `/ikigai-finder`, `/profile`.
- To protect a new route, add it to **both** `PROTECTED_ROUTES` and the `config.matcher` array in `src/proxy.ts`.
- Auth gating relies on the verified Firebase **session cookie** (`getSessionCookieName()`), not client state. Do not move auth checks into client components for security.
- Firestore/Storage are the real security boundary — keep `firestore.rules` and `storage.rules` consistent with any new data path.

## State-management guidance

- Use the existing stores: `useAuthStore`, `useIkigaiStore`, `useProfileStore`, `useUIStore`.
- After any `await` inside a store action, re-verify the active UID before committing state (existing race-condition pattern) — preserve it.
- Persist durable ikigai/profile data through `src/services/*`, not ad hoc Firestore calls in components.

## Testing expectations

- Automated tests currently cover route-protection helpers and ikigai parsing. Do **not** scaffold a large test suite as part of an unrelated change.
- If you add tests, use the existing Vitest runner (`npm test`), keep them non-interactive, and add them alongside the feature they cover rather than as a separate cleanup pass.
- Until meaningful tests exist, `npm run lint && npm run build` is the regression gate.

## Files and systems requiring extra caution

- **`postcss.config.mjs`** — must remain the minimal Tailwind config. This file was previously the target of a malware injection (obfuscated code appended after `export default config;`). Treat any non-trivial content here as suspicious.
- **`src/firebase/firebaseAdmin.ts`** and **`src/lib/auth/*`** — handle admin credentials and session cookies; changes here have security impact.
- **`src/proxy.ts`** — the auth gate. Test redirect behavior carefully.
- **`firestore.rules` / `storage.rules`** — the data security boundary; keep in sync with data paths.
- **`src/lib/rateLimit.ts`** — in-memory and **not** distributed; do not assume global enforcement across instances.
- **`src/lib/generateImage.ts`** — uses an effectively permanent signed-URL expiry (`03-17-2125`); be intentional if you change URL lifetime.
- **`service_key.json`** and **`.env*.local`** — secrets, gitignored. Never read, print, or commit them.
- **Generated/derived files** — `package-lock.json`, `tsconfig.tsbuildinfo`, `.next/`, `next-env.d.ts`. Don't hand-edit; change the source and regenerate.

## Git workflow expectations (main and dev)

- **`main`** is the stable production branch. **Never push to `main`** and never open PRs as part of autonomous runs.
- **`dev`** is the autonomous working branch. All changes are committed directly to `dev` and pushed to `origin/dev`.
- Do **not** create feature branches.
- Before working: `git fetch origin`, checkout `dev`, fast-forward `git pull` `origin/dev`, and inspect the working tree. If there are pre-existing uncommitted changes you did not create, document them and stop unless they are clearly safe to preserve.
- Before committing: re-pull `origin/dev`, integrate any remote changes safely, and re-run validation.
- Use clear, conventional commit messages (e.g. `feat:`, `fix:`, `docs:`, `chore:`).

## Definition of done

A change is done when all of the following hold:

1. It is one focused, PR-sized change with a single clear purpose.
2. `npm run lint` passes with no new warnings/errors.
3. `npm run build` passes (type-check + compile) with no new errors.
4. Server/client boundaries, route protection, and Firebase rules remain consistent.
5. No secrets, generated files, or unrelated files were committed by mistake.
6. Relevant docs (`spec.md`, `README.md`, this file) are updated when behavior or structure changes.
7. The change is committed to `dev` and pushed to `origin/dev`.

## Rules for autonomous Codex runs

- **Make exactly one focused, PR-sized change per run**, even though you commit directly to `dev`. Do not bundle unrelated edits.
- Prefer completing or improving an existing product capability (see the roadmap in `spec.md`) over speculative refactors or large cleanups.
- Read `spec.md` and pick the next roadmap item by product impact and dependency order unless the task specifies otherwise.
- Do not switch package managers, frameworks, or major libraries.
- Do not modify generated files unless the source change requires regeneration.
- Keep diffs minimal and reviewable; preserve existing patterns and file layout.
- Update `spec.md`'s roadmap/current-state when you ship a roadmap item.
- Always end a run by validating, committing to `dev`, and pushing `origin/dev`.

## Stop conditions

Stop and report instead of guessing when:

- Pre-existing uncommitted changes are present that you did not create and cannot clearly preserve safely.
- `npm run lint` or `npm run build` fails for reasons unrelated to your change and you cannot fix it within the change's scope.
- A change would require pushing to `main`, opening a PR, force-pushing, or rewriting history.
- A task needs secrets, external accounts, or manual/interactive steps you cannot perform non-interactively.
- A change would alter `firestore.rules`/`storage.rules`, auth, or billing-affecting AI usage in a way whose impact you cannot verify.
- The scope is larger than one focused PR-sized change — split it and do the first slice only.
