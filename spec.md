# Ikigai Finder AI — Product Spec

> Single authoritative product/spec/roadmap document. For engineering conventions and autonomous-agent rules, see [`AGENTS.md`](./AGENTS.md). For setup/deploy instructions, see [`README.md`](./README.md).
>
> Conclusions inferred from the codebase (rather than stated in prior docs) are marked **[inferred]**.

---

## 1. Product overview

### Product promise

Help a person move from "I don't know what my purpose is" to **a small set of concrete, personalized ikigai statements they can choose from, illustrate, and share** — in a single guided session, in minutes, for free.

### Target users

- Individuals exploring life/career purpose (the Japanese _ikigai_ framing).
- Coaches, students, and people in career transition who want a structured, reflective prompt rather than a blank page.
- Casual visitors who arrive via a shared ikigai card and convert into users. **[inferred from the public share page + social-share features]**

### Core workflows

1. **Sign in** — Google, email/password, or email-link ("magic link") via Firebase Auth.
2. **Reflect** — answer a multi-step questionnaire about loves, skills, what the world needs, and what one could be paid for.
3. **Generate** — GPT‑4o streams ~10 candidate ikigai statements, each scored on Passion, Profession, Vocation, Mission, and Overall Compatibility.
4. **Choose** — the user selects a preferred statement, saved to their profile.
5. **Illustrate** — generate an AI cover image (Stable Diffusion XL via Fireworks), stored in Firebase Storage.
6. **Share** — opt in to a public page (`/ikigai/[id]`), share to social networks, and download a card image.
7. **Manage** — revisit results from a dashboard and edit profile details.

### Product goals

- **Activation:** a new user reaches at least one generated ikigai statement in their first session.
- **Completion:** users select a statement and produce a shareable artifact (statement + image).
- **Reliability:** generation feels fast (streaming), and failures are recoverable.
- **Growth:** shared cards bring new users back into the funnel.
- **Trust:** clear privacy posture; user data stays in the user's own Firebase-scoped records.

---

## 2. Current application state

### What the app currently does

A working end-to-end flow exists: authenticate → questionnaire → streaming GPT‑4o generation of scored ikigai statements → select one → generate and store an AI cover image → toggle public sharing → share/download. Route protection, security headers, input validation/sanitization, and rate limiting are implemented.

### Current feature inventory

- **Auth:** Firebase email/password, Google, and email-link sign-in; httpOnly server **session cookie** minted at `POST /api/auth/session` and cleared at `DELETE`.
- **Questionnaire:** multi-step stepper driven by `src/constants/questions.ts`.
- **Ikigai generation:** server action `src/lib/generateIkigai.ts` (GPT‑4o, temperature 0.7), streamed via `@ai-sdk/rsc`, parsed by `src/utils/ikigaiParser.ts`, with Zod validation, input sanitization, and rate limiting.
- **Selection & persistence:** chosen statement, answers, and guidance saved under `ikigaiUsers/{uid}/ikigai/main` (`src/services/ikigaiService.ts`).
- **Image generation:** server action `src/lib/generateImage.ts` calls Fireworks SDXL, uploads to Firebase Storage (`generated/{uid}/...`), returns a signed URL, and records a cover in history.
- **Sharing:** `PATCH /api/ikigai/sharing` toggles `ikigaiSharableUrl`; public read of the `main` doc is allowed by `firestore.rules` only when sharable; public page at `app/ikigai/[id]`; social buttons + `html2canvas` download.
- **Dashboard & profile:** authenticated areas with `loading.tsx`/`error.tsx` boundaries.
- **Cross-cutting:** CSP/security headers (`next.config.mjs`), cookie-consent banner, Venn/compatibility visualization assets, mobile-first responsive UI.

### Current user flows

- **New user:** landing → sign-in modal → questionnaire → generate → select → image → (optional) share.
- **Returning user:** dashboard → existing ikigai (answers/selection restored from Firestore via default-merge) → regenerate or re-illustrate.
- **Visitor (unauthenticated):** opens a shared `/ikigai/[id]` page; protected routes redirect to `/` with a `redirect` query param.

### Existing integrations

- **OpenAI** (GPT‑4o) via Vercel AI SDK — text generation (`OPENAI_API_KEY`).
- **Fireworks AI** (SDXL) via REST — image generation (`FIREWORKS_API_KEY`).
- **Firebase** — Auth, Firestore, Storage (client Web SDK + Admin SDK).
- **Deployment target:** Vercel (recommended); any Next.js 16 host works. **[inferred from README + config]**

### Current architecture summary

- Next.js 16 App Router; Server Components by default with client `_components` wrappers.
- AI text and image generation are **server actions**; text streams to the client and is parsed into structured `IkigaiData[]`.
- Auth gate centralized in `src/proxy.ts` (verifies the Firebase session cookie for protected segments).
- Data access is **mixed**: client SDK from `src/services/*` (guarded by `firestore.rules`) plus Admin SDK for the sharing API and the public share page.
- State in four Zustand stores with post-await UID re-checks to prevent cross-user races.
- Security boundary enforced by `firestore.rules` (owner-based; conditional public read) and `storage.rules` (user-scoped; deny by default).

### Existing technical constraints

- In-memory rate limiter — correct only for single-instance deployments.
- Free-text AI output parsed by regex (`ikigaiParser.ts`) — depends on the model following the prompt's formatting.
- Firebase project required (Auth + Firestore + Storage) with rules deployed manually (no `firebase.json`/`.firebaserc` committed). **[inferred]**
- Secrets are server-only; only `NEXT_PUBLIC_*` values reach the client.

### Known limitations

- **Rate limiting identity is now derived server-side:** `generateIkigai` and `generateImage` resolve the user from the verified session cookie (`getOptionalServerUid`) rather than a client-supplied value, so limits apply per authenticated user. The underlying store is still in-memory (see below).
- **Not horizontally scalable for limits:** the in-memory store resets per instance/cold start.
- **Signed image URLs are effectively permanent** (`03-17-2125` expiry) — no rotation/expiry strategy.
- **Generation errors are low-visibility:** failures are logged and set in state but lack a clear in-product retry/empty-state. **[inferred]**
- **Abandoned/partial code (largely removed):** the divergent second AI text path (`src/lib/actions.ts` → `generatePurpose`, which used `gpt-4.1`) and its `src/lib/ai/stream.ts` helpers, plus the unused `GenerateImage` and `SurveyQuestion` components, have been removed. Remaining now-orphaned exports (`IKIGAI_SYSTEMPROMPT`, the `questions` constant, the `SurveyQuestion` type) are harmless leftovers slated for a future focused cleanup.
- **Minimal automated-test setup:** `npm test` runs Vitest and currently covers route-protection helpers plus ikigai parsing; no CI is configured. The practical regression gate remains `npm run lint && npm run build`.
- **Legal pages** (privacy policy, terms) were last dated 2022 per prior planning notes.

---

## 3. Product roadmap

Product-oriented, ordered by impact and dependency. Each item is sized for one clean commit sequence on `dev`. (This list supersedes the historical `IMPROVEMENT_PLAN.md`.)

### M1 — Per-user generation limits that actually protect the product — DONE
- **User value:** one user (or a bot) can no longer exhaust generation capacity for everyone; authenticated users get fair, predictable access.
- **Implemented:** both `generateIkigai` and `generateImage` now derive the user from the verified session cookie (`getOptionalServerUid`) server-side and key rate limiting on that uid (stronger than trusting a client-passed value). `generateImage` also rejects unauthenticated calls before any Admin-SDK write. Remaining future work: replace the in-memory limiter with a distributed store before multi-instance scale.

### M2 — Resilient generation UX (error + retry + empty states)
- **User value:** a failed or empty AI response no longer dead-ends the core workflow; users can recover in place.
- **Implementation intent:** surface the `error` from `useIkigaiGenerator` in `GenerateIkigaiForm` with a visible message and a "Try again" action; add an explicit empty state when no statements parse; add a "Generate more" affordance using existing merge logic.
- **Acceptance criteria:**
  - Simulated failure shows a non-blocking error with a working retry.
  - Zero parsed results shows guidance rather than a blank screen.
  - No regression to streaming/scroll behavior; lint + build pass.

### M3 — Reliable resume of an in-progress journey
- **User value:** users can leave and come back without losing answers or their selected ikigai.
- **Implementation intent:** ensure dashboard provides a clear "Continue where you left off" entry that hydrates `useIkigaiStore` from `ikigaiService.fetchIkigaiData`; confirm step deep-linking (`?step=image`) restores correctly.
- **Acceptance criteria:**
  - A returning user lands on their saved answers/selection and can proceed without re-answering.
  - Deep links into the generate flow restore the correct step.
  - Lint + build pass.

### M4 — Cover image history reuse
- **User value:** users can revisit and reselect previously generated covers instead of regenerating (saves time and AI cost).
- **Implementation intent:** read the `ikigaiProfiles/{uid}/covers` history (already written by `saveGeneratedImageHistory`) and present a selectable gallery in the image step; selecting one updates the chosen cover without a new Fireworks call.
- **Acceptance criteria:**
  - Past covers render with thumbnails; selecting one sets it as the active cover.
  - No duplicate Storage writes when reusing an existing cover; lint + build pass.

### M5 — Rich social previews for shared ikigai
- **User value:** shared links render attractive cards on social platforms, improving click-through and growth.
- **Implementation intent:** add dynamic Open Graph/Twitter metadata for `app/ikigai/[id]` (title from the selected statement, image from the generated cover), using `NEXT_PUBLIC_BASE_URL`.
- **Acceptance criteria:**
  - A shared public ikigai URL exposes correct OG/Twitter tags and a preview image.
  - Private (non-sharable) ikigai do not leak data in metadata; lint + build pass.

### M6 — Iterative refinement loop for statements
- **User value:** users can steer results ("more career-focused", "more creative") and converge on a statement they love.
- **Implementation intent:** make the existing `guidance` input a first-class refine control on the results screen that re-runs generation with the guidance and merges results, with clear affordances.
- **Acceptance criteria:**
  - Submitting guidance produces visibly adjusted statements merged into the list.
  - Guidance persists with the saved ikigai; lint + build pass.

### M7 — Consolidate AI generation paths and retire dead code — MOSTLY DONE
- **User value (product reliability):** removes a second, divergent generation path (`generatePurpose`, `gpt-4.1`) and unused UI so future product work can't accidentally ship via the wrong, untested path.
- **Implemented:** removed `src/lib/actions.ts`, `src/lib/ai/stream.ts`, and the unused `GenerateImage`/`SurveyQuestion` components; a single GPT‑4o path (`generateIkigai`) remains.
- **Remaining (small):** delete the now-orphaned `IKIGAI_SYSTEMPROMPT` constant, the `questions` constant, and the `SurveyQuestion` type once confirmed unneeded.

### M8 — Refresh legal/compliance pages
- **User value:** accurate, current privacy/terms increase trust and reduce legal risk.
- **Implementation intent:** update `app/privacy-policy` and `app/terms-conditions` content and dates to reflect current data handling (Firebase scoping, AI processing, cookie consent).
- **Acceptance criteria:**
  - Pages state current practices and a current effective date; lint + build pass.

### Out of scope / non-goals (for now)

- Distributed rate limiting (Redis) — only needed once multi-instance scale is real; revisit after M1.
- New major product directions unsupported by the current app (teams, payments, coaching marketplace, etc.).
- Large structural refactors or test-suite build-outs as standalone initiatives — add tests with the features they cover.
