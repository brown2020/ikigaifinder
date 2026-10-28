# AGENTS.md

Authoritative operating guide for autonomous coding agents (Codex, Claude, etc.) working in this repository. Read this file in full before making any change. For the product as built, read [`spec.md`](./spec.md). For what to do next, read [`roadmap.md`](./roadmap.md).

---

## Project overview

**Ikigai Finder AI** is a Next.js 16 web application that helps people discover their _ikigai_ (生き甲斐, "a reason for being") through an AI-guided questionnaire. It generates personalized ikigai statements with compatibility scores, lets users create an AI-generated cover image, and produces a shareable card.

## Product purpose

Turn a short, structured self-reflection survey into a small set of concrete, personalized ikigai statements (each scored across Passion, Profession, Vocation, Mission, and overall compatibility), then let the user pick one, illustrate it, and share it. See [`spec.md`](./spec.md) for the full product definition.

## Current tech stack

- **Runtime:** Node.js 22+
- **Framework:** Next.js 16 (App Router) — `next` `^16.4.3`
- **Language:** TypeScript `^6.0.3` (strict; not 7 until `typescript-eslint` allows it), React `19.3`
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`), utility-first, no CSS-in-JS
- **State:** Zustand 5 (with `devtools`)
- **Auth + data:** Firebase Web SDK 13 (client) + Firebase Admin 14 (server)
- **AI text:** Vercel AI SDK (`ai` v7) + `@ai-sdk/openai` v4 (`gpt-6.1-sol`, low reasoning effort), streamed to the client via `@ai-sdk/rsc` v3 (`createStreamableValue` / `readStreamableValue`). Model IDs and provider options live only in `src/constants/ai.ts`; reasoning models reject `temperature`, so don't add it back.
- **AI images:** OpenAI `gpt-image-2.5-flare` through the AI SDK `generateImage` (`IMAGE_MODEL` in `src/constants/ai.ts`), one attempt per request with no retries so a lost response can't bill twice.
- **Forms:** React Hook Form 7 + Zod 4
- **Lint:** ESLint 9 + `eslint-config-next`
- **Package manager:** **npm** (lockfile: `package-lock.json`). Do not switch package managers.

## Repository structure

```
src/
├── proxy.ts                  # Next.js 16 route protection (Node runtime, verifies session cookie)
├── app/                      # App Router pages + API routes
│   ├── api/
│   │   ├── account/          # DELETE deletes the caller's account and all data (lib/accountDeletion.ts)
│   │   ├── auth/session/     # POST creates session cookie, DELETE clears it
│   │   ├── downloadImage/    # GET image proxy (CORS) for downloads
│   │   └── ikigai/sharing/   # PATCH toggle public sharing (admin SDK)
│   ├── ikigai-finder/        # Questionnaire, ?step=1-4, and quick/ (4-question start); public, guests answer before signing up
│   ├── generate-ikigai/      # Ideas step; report/ = insights; card/ = card designer (protected)
│   ├── ikigai/[id]/          # Public shareable ikigai page
│   ├── dashboard/ profile/   # "My ikigai" hub (resume + share) and account
│   ├── robots.ts sitemap.ts  # Crawl rules + public-route sitemap (origin from utils/siteUrl.ts)
│   └── (marketing/legal)/    # home, about (FAQ + FAQPage JSON-LD), support, privacy-policy, terms-conditions
├── components/
│   ├── ui/                   # Primitives (Button/ButtonLink, Card, Input/Textarea, Skeleton, Eyebrow, …)
│   ├── layout/               # SiteHeader, UserMenu, MobileNav, SiteFooter (rendered by root layout)
│   ├── journey/              # Questionnaire, IdeasStep, CardStep, JourneyProgress, JourneyGate
│   ├── ikigai/               # IkigaiDiagram, IkigaiCard (export target), ScoreBars
│   ├── share/                # SharePanel (visibility toggle, link, social, download)
│   ├── home/                 # Landing-page client islands
│   ├── auth/                 # AuthModal, AuthForm, SocialLogin, SignedInView
│   └── icons/
├── lib/
│   ├── generateIkigai.ts     # SERVER ACTION: OpenAI structured ikigai generation (rate-limited, validated)
│   ├── ikigaiServer.ts       # server-only Admin SDK summary read (dashboard + share page)
│   ├── generateReport.ts     # SERVER ACTION: OpenAI personal insights report for the chosen statement
│   ├── generateImage.ts      # SERVER ACTION: OpenAI image → Firebase Storage → /api/media
│   ├── rateLimit.ts          # Firestore quota shared across instances (memory only in tests)
│   ├── validation.ts         # Zod schemas + sanitizeInput()
│   ├── errors.ts             # Custom error classes
│   └── auth/                 # session cookie helpers (server + client)
├── services/                 # Firestore data layer (ikigaiService, profileService, userService)
├── hooks/                    # use-auth-actions, use-auth-token, use-ikigai-generator
├── zustand/                  # useAuthStore, useIkigaiStore, useProfileStore, useUIStore
├── constants/                # ikigai.ts (circles/overlaps), questions.ts, systemPrompt.ts, menuItems.ts
├── utils/                    # ikigaiList, journey, downloadImage, canvasUtils, promptUtils, siteUrl (canonical origin for links, metadata, JSON-LD), …
├── firebase/                 # firebaseClient.ts, firebaseAdmin.ts
└── types/                    # Centralized TypeScript types (index.ts)

firestore.rules               # Owner-only access; shared pages read via the Admin SDK, never public client reads
storage.rules                 # User-scoped paths; deny by default
env.sample                    # Required environment variables (copy to .env.local)
```

## Core architecture overview

- **App Router + RSC.** Pages default to Server Components; interactive UI is split into `_components/*-page.tsx` client components.
- **AI text generation** runs as a Next.js **server action** (`src/lib/generateIkigai.ts`) using AI SDK structured output (`Output.array` + Zod schema). It streams the cumulative list of completed statements with `@ai-sdk/rsc`; the client consumes it in `src/hooks/use-ikigai-generator.ts` and dedupes with `src/utils/ikigaiList.ts`, which puts each new batch ahead of the existing list. Score fields map to the classic overlaps: Passion (love+skill), Mission (love+world), Vocation (world+paid), Profession (skill+paid).
- **AI image generation** is a server action (`src/lib/generateImage.ts`) that calls OpenAI image generation through the AI SDK, uploads the result to Firebase Storage with the Admin SDK, and returns a same-origin `/api/media` URL. The media and download routes read bytes with the Admin SDK only for the owner or the current public cover.
- **Auth flow:** client signs in with the Firebase Web SDK → obtains an ID token → `POST /api/auth/session` verifies it and sets an **httpOnly session cookie** via `adminAuth.createSessionCookie`. `src/proxy.ts` verifies that cookie (with revocation check) for protected route segments only.
- **Data access is mixed:** most reads/writes use the **client** Firebase SDK from `src/services/*` (guarded by `firestore.rules`); a few server paths (`/api/ikigai/sharing`, `/api/account`, the public share page) use the **Admin SDK**. The client Firestore and Storage SDKs load on first use through `loadFirestore()` / `loadStorage()` in `src/firebase/firebaseClient.ts`; never import `firebase/firestore` or `firebase/storage` statically in client code (type-only imports are fine), or the ~200 KB SDKs return to every page's first load. Budget: ≤300 KB gzip first-load JS on `/` and `/ikigai-finder/quick`.
- **State:** four small Zustand stores wrapped with `withDevtools` (`src/zustand/middleware.ts`); UID is re-checked after async work to avoid cross-user race conditions. `useIkigaiStore.status` tracks initial hydration; journey pages render through `JourneyGate` so they never act on unloaded data. Stores reset on sign-out.
- **Design system:** tokens live in `src/app/globals.css` as hex values (html2canvas cannot read oklch). Use semantic Tailwind classes (`bg-card`, `text-muted-foreground`, `text-primary`, `border-border`, domain colors `love/skill/world/paid`), never Tailwind's default palette. Fonts: Fraunces (`font-display`) and Geist (sans) via `next/font`.

## Key app features that exist today

- Email/password, Google, and email-link ("magic link") sign-in (Firebase Auth). Google is never offered inside the React Native app (`isReactNativeWebView()` in `src/utils/platform.ts` checks the injected `window.ReactNativeWebView`, which also covers iPad, whose webview reports a Mac user agent).
- Complete in-app account deletion from `/profile`: `DELETE /api/account` verifies a fresh ID token and deletes both Storage prefixes, both Firestore trees, and the Auth user last; it is never refused and is safe to retry.
- Four-part ikigai questionnaire (`src/constants/questions.ts`); section/question ids are persisted, and titles/labels always come from code.
- Streaming OpenAI generation of ~10 ikigai statements, each with compatibility scores.
- Selection of a preferred statement, persisted per user in Firestore.
- AI cover-image generation (OpenAI) stored in Firebase Storage, with a cover history.
- Public sharing toggle + public `/ikigai/[id]` page + social share buttons + downloadable card (`html2canvas`), with dynamic OG metadata when public.
- Dashboard and editable profile.
- Security headers (`next.config.mjs`) and a per-request nonce CSP (`src/proxy.ts`), input sanitization, Firestore rate limiting, cookie-consent banner.

## Important commands

```bash
npm install        # install deps (uses package-lock.json)
npm run dev        # local dev server (DO NOT run in autonomous validation — long-running)
npm run build      # production build; runs TypeScript type-checking
npm run start      # serve a production build
npm run lint       # ESLint
npm test           # Vitest one-shot: proxy, list utils, account deletion, route handlers, env.sample drift
npm run test:rules # Firestore/Storage rules on the emulators (Java 21; npx-pinned firebase-tools)
npx tsc --noEmit   # standalone type-check (no dedicated npm script exists)
```

## Canonical validation/check command

Vitest is wired as a one-shot runner via `npm test` and covers `src/proxy.ts`, the ikigai list utilities, account deletion, the sharing and account route handlers (including wrong-user and revoked-token denials), and `env.sample` drift. `npm run test:rules` runs the Firestore and Storage rules against the emulators; CI runs both. The canonical, non-interactive regression check is:

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

- Server actions live in `src/lib/*` and start with `"use server"`. They are the only place secrets (`OPENAI_API_KEY`, Firebase Admin creds) may be read.
- Never import `src/firebase/firebaseAdmin.ts`, server actions' internals, or any secret into a `"use client"` module.
- Only `NEXT_PUBLIC_*` env vars may be referenced in client code. Everything else is server-only.
- The client consumes AI output via streamable values from server actions — keep that contract intact when editing generation code.

## Route-protection guidance

- Route protection is centralized in `src/proxy.ts` (Next.js 16 proxy, Node runtime). Protected segments: `/dashboard`, `/generate-ikigai`, `/profile`. `/ikigai-finder` is public so visitors can answer before signing up: guest answers live in `localStorage` (`src/utils/guestDraft.ts`) and are adopted into the account on first sign-in by `useIkigaiStore.fetchIkigai`. All AI generation still requires a session.
- To protect a new route, add it to **both** `PROTECTED_ROUTES` and the `config.matcher` array in `src/proxy.ts`.
- Auth gating relies on the verified Firebase **session cookie** (`getSessionCookieName()`), not client state. Do not move auth checks into client components for security.
- Firestore/Storage are the real security boundary — keep `firestore.rules` and `storage.rules` consistent with any new data path.

## State-management guidance

- Use the existing stores: `useAuthStore`, `useIkigaiStore`, `useProfileStore`, `useUIStore`.
- After any `await` inside a store action, re-verify the active UID before committing state (existing race-condition pattern) — preserve it.
- Persist durable ikigai/profile data through `src/services/*`, not ad hoc Firestore calls in components.

## Testing expectations

- Automated tests cover route protection, list utilities, account deletion, route-handler authorization, rules (emulator), and env drift. Do **not** scaffold a large test suite as part of an unrelated change.
- If you add tests, use the existing Vitest runner (`npm test`), keep them non-interactive, and add them alongside the feature they cover rather than as a separate cleanup pass.
- Until meaningful tests exist, `npm run lint && npm run build` is the regression gate.

## Operations: monitoring and rollback

- **Production smoke** (`.github/workflows/production-smoke.yml`) runs `node scripts/smoke-hosted.mjs` after every successful Vercel Production deployment, daily, and on demand. The probes are read-only (no account, AI call, or write): landing page, `robots.txt`, anonymous `/dashboard` redirect, and 401s from `/api/account` and `/api/ikigai/sharing`. A failed run is the alert; GitHub emails the operator. `src/hostedHealth.test.ts` proves outages and open auth boundaries fail the check.
- **Notification drill:** `gh workflow run production-smoke.yml --ref dev -f notification_drill=true` fails on purpose before probing; confirm the GitHub failure email arrives.
- **Website rollback** (Vercel project `ignitechannel/ikigaifinder`): record the failing deployment and evidence, run `vercel ls ikigaifinder --scope ignitechannel --prod`, then `vercel rollback <previous-production-deployment-url> --scope ignitechannel`. Run `node scripts/smoke-hosted.mjs`, then verify sign-in, ideas, card, and sharing. Return with `vercel promote <fixed-deployment-url> --scope ignitechannel`. A website rollback does not revert Firestore/Storage rules or data.
- Vercel runs Node 24.x; CI runs Node 22 (the supported minimum).

## Files and systems requiring extra caution

- **`postcss.config.mjs`** — must remain the minimal Tailwind config. This file was previously the target of a malware injection (obfuscated code appended after `export default config;`). Treat any non-trivial content here as suspicious.
- **`src/firebase/firebaseAdmin.ts`** and **`src/lib/auth/*`** — handle admin credentials and session cookies; changes here have security impact.
- **`src/proxy.ts`** — the auth gate. Test redirect behavior carefully.
- **`src/lib/accountDeletion.ts`** — lists every per-user Firestore tree and Storage prefix. When you add a per-user data path, add it here and to its test, or account deletion (required for the mobile app stores) leaves data behind.
- **`firestore.rules` / `storage.rules`** — the data security boundary; keep in sync with data paths. Don't reintroduce public client reads of the ikigai doc: it holds private answers, reports, and history. Expose shared data through `getIkigaiSummary` instead. Rule changes take effect only after `firebase deploy --only firestore:rules`.
- **`src/lib/rateLimit.ts`** — production quotas live in `_rateLimits` (Admin SDK, denied to clients). A store error fails closed. The in-memory counter runs only when `NODE_ENV` is `test`.
- **`src/lib/generateImage.ts`** — returns `/api/media` paths, not signed URLs. Objects already issued with a long-lived signed URL stay reachable until deleted or the signing key is rotated.
- **`service_key.json`** and **`.env*.local`** — secrets, gitignored. Never read, print, or commit them.
- **Generated/derived files** — `package-lock.json`, `tsconfig.tsbuildinfo`, `.next/`, `next-env.d.ts`. Don't hand-edit; change the source and regenerate.
- **Dependency policy** — `package.json` intentionally pins reviewed install scripts with `allowScripts` and uses overrides to keep Next/Firebase transitive dependencies on patched compatible releases. Review changed lifecycle scripts before re-approving them, and require a clean audit plus full validation before removing overrides. Current overrides include `sharp` 0.35.5, `@grpc/grpc-js` 1.14.6 under `@firebase/firestore` (the SDK uses it only as a Node client), `@fastify/busboy` and `source-map-js`; drop each once its parent ships the patched version. `npm audit --omit=dev` must stay at 0. The remaining dev-only advisory is `braces` (via `eslint-config-next` → `fast-glob`), which has no patched release and only processes this repo's own lint globs; revisit when a fixed `braces` or `fast-glob` ships.
- **Node types** — keep `@types/node` on the latest 22.x release while Node 22 is the minimum supported runtime; newer type majors can expose APIs unavailable in production.
- **TypeScript 7** — currently incompatible with the latest `typescript-eslint` parser used by `eslint-config-next` (which supports TypeScript `<6.1`); keep TypeScript on the latest 6.x release until that peer range advances.
- **ESLint 10** — `eslint-config-next` still installs React/import/accessibility plugins whose peer ranges stop at ESLint 9; keep ESLint on the latest 9.x release until those peers add ESLint 10 support.

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
