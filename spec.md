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

1. **Reflect** — answer a multi-step questionnaire about loves, skills, what the world needs, and what one could be paid for. No account is needed to start; answers stay on the device.
2. **Sign in** — Google, email/password, or email-link ("magic link") via Firebase Auth, asked for when the visitor wants to see ideas. Guest answers carry into the account.
3. **Generate** — OpenAI (`gpt-6.1-sol`) streams ~10 candidate ikigai statements, each scored on Passion, Profession, Vocation, Mission, and Overall Compatibility.
4. **Choose** — the user selects a preferred statement, saved to their profile.
5. **Illustrate** — generate an AI cover image (OpenAI `gpt-image-2.5-flare`), stored in Firebase Storage.
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

A working end-to-end flow exists: authenticate → questionnaire → streaming OpenAI generation of scored ikigai statements → select one → generate and store an AI cover image → toggle public sharing → share/download. Route protection, security headers, input validation/sanitization, and rate limiting are implemented.

### Current feature inventory

- **Auth:** Firebase email/password, Google, and email-link sign-in; httpOnly server **session cookie** minted at `POST /api/auth/session` and cleared at `DELETE`.
- **Questionnaire:** four parts (one per circle) driven by `src/constants/questions.ts`, deep-linkable via `?step=1-4`, saved on every step.
- **Ikigai generation:** server action `src/lib/generateIkigai.ts` (`TEXT_MODEL` in `src/constants/ai.ts`, low reasoning effort) using structured output (Zod schema, `Output.array`), streamed per completed statement via `@ai-sdk/rsc`, with validation, sanitization, rate limiting, and an "avoid these" list so "Generate more" returns new angles. Users can steer with guidance and edit the chosen statement's wording.
- **Selection & persistence:** chosen statement, answers, and guidance saved under `ikigaiUsers/{uid}/ikigai/main` (`src/services/ikigaiService.ts`).
- **Image generation:** server action `src/lib/generateImage.ts` calls OpenAI image generation through the AI SDK (one attempt, no retries), uploads to Firebase Storage (`generated/{uid}/...`), returns a signed URL, and records a cover in history.
- **Sharing:** `PATCH /api/ikigai/sharing` toggles `ikigaiSharableUrl`; the public page at `app/ikigai/[id]` reads a minimal summary (cover, statement, map words) through the Admin SDK only when sharable; `firestore.rules` never allows public client reads; social buttons + `html2canvas` download.
- **Dashboard & profile:** authenticated areas with `loading.tsx`/`error.tsx` boundaries.
- **Account deletion:** `/profile` → type DELETE ACCOUNT → `DELETE /api/account` (fresh ID token, revocation-checked) deletes `generated/{uid}/` and `users/{uid}/` in Storage, the `ikigaiUsers/{uid}` and `ikigaiProfiles/{uid}` trees, then the Auth user, and clears the session cookie. Success is shown only after the server confirms; the client then signs out and clears local drafts. Retrying after a partial failure finishes the job.
- **Native app:** inside the React Native webview, Google sign-in is hidden on iPhone and iPad; email/password and email-link sign-in remain.
- **Cross-cutting:** CSP/security headers (`next.config.mjs`), cookie-consent banner, four-circle ikigai diagram and overlap score bars, mobile-first responsive UI.

### Current user flows

- **New user:** landing → sign-in modal → questionnaire → generate → select → image → (optional) share.
- **Returning user:** dashboard → existing ikigai (answers/selection restored from Firestore via default-merge) → regenerate or re-illustrate.
- **Visitor (unauthenticated):** opens a shared `/ikigai/[id]` page; protected routes redirect to `/` with a `redirect` query param.

### Existing integrations

- **OpenAI** (`gpt-6.1-sol`) via Vercel AI SDK — text generation (`OPENAI_API_KEY`).
- **OpenAI** image generation (`gpt-image-2.5-flare`) via the AI SDK — card backgrounds (same `OPENAI_API_KEY`).
- **Firebase** — Auth, Firestore, Storage (client Web SDK + Admin SDK).
- **Deployment target:** Vercel (recommended); any Next.js 16 host works. **[inferred from README + config]**

### Current architecture summary

- Next.js 16 App Router; Server Components by default with client `_components` wrappers.
- AI text and image generation are **server actions**; text streams to the client and is parsed into structured `IkigaiData[]`.
- Auth gate centralized in `src/proxy.ts` (verifies the Firebase session cookie for protected segments).
- Data access is **mixed**: client SDK from `src/services/*` (guarded by `firestore.rules`) plus Admin SDK for the sharing API and the public share page.
- State in four Zustand stores with post-await UID re-checks to prevent cross-user races.
- Security boundary enforced by `firestore.rules` (owner-only; no public reads) and `storage.rules` (user-scoped; deny by default).

### Existing technical constraints

- Node.js 22+ is required by the current AI SDK 7 and Firebase Admin 14 releases.
- TypeScript remains on the latest 6.x release because the current `typescript-eslint` parser used by `eslint-config-next` supports TypeScript `<6.1`; TypeScript 7 causes the lint toolchain to crash.
- ESLint remains on the latest 9.x release because the React/import/accessibility plugins bundled by the current `eslint-config-next` release do not yet declare ESLint 10 compatibility.
- In-memory rate limiter — correct only for single-instance deployments.
- Firebase project required (Auth + Firestore + Storage) with rules deployed manually (no `firebase.json`/`.firebaserc` committed). **[inferred]**
- Secrets are server-only; only `NEXT_PUBLIC_*` values reach the client.

### Known limitations

- **Rate limiting identity is now derived server-side:** `generateIkigai` and `generateImage` resolve the user from the verified session cookie (`getOptionalServerUid`) rather than a client-supplied value, so limits apply per authenticated user. The underlying store is still in-memory (see below).
- **Not horizontally scalable for limits:** the in-memory store resets per instance/cold start.
- **Signed image URLs are effectively permanent** (`03-17-2125` expiry) — no rotation/expiry strategy.
- **Generation errors are low-visibility:** failures are logged and set in state but lack a clear in-product retry/empty-state. **[inferred]**
- **Abandoned/partial code removed:** the divergent second AI text path (`src/lib/actions.ts` → `generatePurpose`, which used `gpt-4.1`) and its `src/lib/ai/stream.ts` helpers, unused legacy generation/questionnaire exports, and unused `GenerateImage`/`SurveyQuestion` components have been removed. A single GPT‑4o path (`generateIkigai`) remains.
- **Minimal automated-test setup:** `npm test` runs Vitest and currently covers route-protection helpers plus ikigai parsing; no CI is configured. The practical regression gate remains `npm run lint && npm run build`.
- **Legal pages** (privacy policy, terms) were last dated 2022 per prior planning notes.

---

## 3. Product roadmap

Product-oriented, ordered by impact and dependency. Each item is sized for one clean commit sequence on `dev`. (This list supersedes the historical `IMPROVEMENT_PLAN.md`.)

### M1 — Per-user generation limits that actually protect the product — DONE
- **User value:** one user (or a bot) can no longer exhaust generation capacity for everyone; authenticated users get fair, predictable access.
- **Implemented:** both `generateIkigai` and `generateImage` now derive the user from the verified session cookie (`getOptionalServerUid`) server-side and key rate limiting on that uid (stronger than trusting a client-passed value). `generateImage` also rejects unauthenticated calls before any Admin-SDK write. Remaining future work: replace the in-memory limiter with a distributed store before multi-instance scale.

### M2 — Resilient generation UX (error + retry + empty states) — DONE
- **User value:** a failed or empty AI response no longer dead-ends the core workflow; users can recover in place.
- **Implementation intent:** surface the `error` from `useIkigaiGenerator` in `GenerateIkigaiForm` with a visible message and a "Try again" action; add an explicit empty state when no statements parse; add a "Generate more" affordance using existing merge logic.
- **Acceptance criteria:**
  - Simulated failure shows a non-blocking error with a working retry.
  - Zero parsed results shows guidance rather than a blank screen.
  - No regression to streaming/scroll behavior; lint + build pass.

### M3 — Reliable resume of an in-progress journey — DONE
- **User value:** users can leave and come back without losing answers or their selected ikigai.
- **Implementation intent:** ensure dashboard provides a clear "Continue where you left off" entry that hydrates `useIkigaiStore` from `ikigaiService.fetchIkigaiData`; confirm step deep-linking (`?step=image`) restores correctly.
- **Acceptance criteria:**
  - A returning user lands on their saved answers/selection and can proceed without re-answering.
  - Deep links into the generate flow restore the correct step.
  - Lint + build pass.

### M4 — Cover image history reuse — DONE
- **User value:** users can revisit and reselect previously generated covers instead of regenerating (saves time and AI cost).
- **Implementation intent:** read the `ikigaiProfiles/{uid}/covers` history (already written by `saveGeneratedImageHistory`) and present a selectable gallery in the image step; selecting one updates the chosen cover without a new Fireworks call.
- **Acceptance criteria:**
  - Past covers render with thumbnails; selecting one sets it as the active cover.
  - No duplicate Storage writes when reusing an existing cover; lint + build pass.

### M5 — Rich social previews for shared ikigai — DONE
- **User value:** shared links render attractive cards on social platforms, improving click-through and growth.
- **Implementation intent:** add dynamic Open Graph/Twitter metadata for `app/ikigai/[id]` (title from the selected statement, image from the generated cover), using `NEXT_PUBLIC_BASE_URL`.
- **Acceptance criteria:**
  - A shared public ikigai URL exposes correct OG/Twitter tags and a preview image.
  - Private (non-sharable) ikigai do not leak data in metadata; lint + build pass.

### M6 — Iterative refinement loop for statements — DONE
- **User value:** users can steer results ("more career-focused", "more creative") and converge on a statement they love.
- **Implementation intent:** make the existing `guidance` input a first-class refine control on the results screen that re-runs generation with the guidance and merges results, with clear affordances.
- **Acceptance criteria:**
  - Submitting guidance produces visibly adjusted statements merged into the list.
  - Guidance persists with the saved ikigai; lint + build pass.

### M7 — Consolidate AI generation paths and retire dead code — DONE
- **User value (product reliability):** removes a second, divergent generation path (`generatePurpose`, `gpt-4.1`) and unused UI so future product work can't accidentally ship via the wrong, untested path.
- **Implemented:** removed `src/lib/actions.ts`, `src/lib/ai/stream.ts`, the unused `GenerateImage`/`SurveyQuestion` components, the legacy `IKIGAI_SYSTEMPROMPT`, the unused `questions` constant, the unused `SurveyQuestion` type, and the unused `testData` fixture; a single GPT‑4o path (`generateIkigai`) remains.

### M8 — Refresh legal/compliance pages
- **User value:** accurate, current privacy/terms increase trust and reduce legal risk.
- **Implementation intent:** update `app/privacy-policy` and `app/terms-conditions` content and dates to reflect current data handling (Firebase scoping, AI processing, cookie consent).
- **Acceptance criteria:**
  - Pages state current practices and a current effective date; lint + build pass.

### M9 — Answer before signing up — DONE
- **User value:** visitors see the questions (and invest in them) before being asked for an account, removing the sign-up wall in front of the first question.
- **Implemented:** `/ikigai-finder` is no longer protected. Signed-out answers are kept in `localStorage` (`src/utils/guestDraft.ts`) and hydrated by `useIkigaiStore.loadGuest`. Finishing the questionnaire as a guest opens the sign-up dialog with a reason; on first sign-in `fetchIkigai` adopts the guest answers when they go further than the account's saved answers. All AI generation still requires a session.

### M10 — Quick start — DONE
- **User value:** a first set of ideas in about two minutes instead of ten; the full reflection becomes an optional way to sharpen them.
- **Implemented:** `/ikigai-finder/quick` asks one question per circle (`QUICK_QUESTION_IDS`). Ideas unlock once every circle has at least one answer (`canGenerate`); the ideas step invites quick-path users to go deeper. Blank questions are no longer sent to the model. The home page CTA leads to the quick start.

### M11 — Personal insights report — DONE
- **User value:** choosing a statement now pays off with a short report: why it fits (each circle tied to the person's own words), their growth edge, three first steps for this week, and paths to explore.
- **Implemented:** `generateIkigaiReport` server action (`src/lib/generateReport.ts`, OpenAI structured output, session-gated and rate-limited on the same AI limiter). The report is saved on the ikigai doc as `ikigaiReport`, keyed to the statement it explains, so it is written once per selection. New journey step "Insights" at `/generate-ikigai/report`, between Ideas and Card.

### M12 — Personal ikigai map — DONE
- **User value:** the ikigai diagram shows the person's own words in each circle, a screenshot-worthy artifact that is theirs rather than generic.
- **Implemented:** the report includes two or three keywords per circle; `IkigaiDiagram` takes `words` and renders them (with an accessible label listing them). The map appears on the insights page, the dashboard, and the public share page when sharing is on (`getIkigaiSummary` returns `keywords` only when the report matches the selected statement).

### M13 — One-tap refinement — DONE
- **User value:** steering ideas no longer requires writing a prompt.
- **Implemented:** `REFINE_PRESETS` chips (more creative, more practical, smaller scale, bigger impact, less corporate, more hands-on) run a batch with that steer without overwriting the person's typed guidance; the selected statement offers "More like this" for close variations. Existing in-place wording edits remain.

### M14 — Shortlist, compare, and blend — DONE
- **User value:** people can keep several statements they like, compare their scores side by side, and ask for new ones that blend them, instead of committing to one.
- **Implemented:** `ikigaiShortlist` on the ikigai doc (kept when new answers clear the options). Every statement card has a Shortlist toggle; the ideas step switches between all ideas and the shortlist, which shows `ShortlistCompare` (per-overlap scores with each column's leader marked) and a "Blend these" action.

### M15 — Check-ins and ikigai history — DONE
- **User value:** a reason to come back. The dashboard invites a check-in every three months and shows how the person's statement has changed over time.
- **Implemented:** choosing a different statement records `ikigaiSelectedAt` and moves the previous one into `ikigaiHistory` (ISO dates, last 20). `CheckInCard` on the dashboard shows when the statement was chosen, highlights a check-in once 90 days pass, offers a downloadable `.ics` reminder (`src/utils/calendar.ts`, no server-side reminders), and lists past statements.

### M16 — 7-day experiment — DONE
- **User value:** turns insight into action. The report's three first steps become a week-long checklist the person ticks off from the dashboard.
- **Implemented:** `ExperimentCard` (insights page and dashboard) starts an `ikigaiExperiment` from the current report's first steps, keyed to the selected statement, and shows day N of 7 with progress and toggles.

### M17 — Sharing that converts, in more sizes — DONE
- **User value:** a shared card now leads visitors straight into the two-minute, no-sign-up start, and owners can post to Stories and LinkedIn without cropping.
- **Implemented:** public-page CTAs go to `/ikigai-finder/quick`. `IkigaiCard` takes a `format` (square, story 9:16, wide 1.91:1) with `cqmin`-based type; `CardFormatDownloads` renders the chosen size off-screen and downloads a 1080×1920 or 1200×630 PNG (card step and dashboard). The card name is saved as `ikigaiCardName` for re-rendering.

### M18 — Easier answering: autosave, prompts, dictation — DONE
- **User value:** answers survive a refresh or closed tab, people who get stuck have somewhere to start, and people can talk instead of type.
- **Implemented:** `useAnswerAutosave` saves answers about a second after typing stops (quiet saves that don't flip `isSaving`) with a status line. Every written question has three reflective `hints` behind "Stuck? Try a prompt". `AnswerField` adds a Dictate button using the browser's Web Speech API (`useSpeechInput`, hidden where unsupported); `Permissions-Policy` now allows `microphone=(self)`.

### M19 — Sharper, plainer statements — DONE
- **User value:** statements read like something a person would say out loud, not a stitched-together list of answers.
- **Implemented:** `IKIGAI_SYSTEM_PROMPT` sets a priority order (the person's guidance, then their answers, then variety of angle and sentence structure) and strict style rules: 10 to 22 words, one clear idea, no tacked-on "while…"/", enabling…" clauses, and no jargon. The examples in the prompt and on the home page follow the same rules.

### M20 — New ideas first — DONE
- **User value:** after "Generate more", a steer, or "More like this", the new statements appear at the top instead of below a long list.
- **Implemented:** `mergeIkigaiLists` puts unseen statements ahead of the current list. The ideas step marks the latest batch with a "New" badge, shows the loading placeholder beside it, scrolls the list back into view when a batch starts from further down the page, and announces how many were added. Only the newest 20 statements (`recentStatements`) are sent as "avoid these", so long idea lists never exceed the server's limit; older repeats are still dropped on the client.

### M21 — Findable, and clear about how it works — DONE
- **User value:** search engines can find and describe the public pages, and visitors get straight answers about cost, accounts, privacy, and AI before they start.
- **Implemented:** `/robots.txt` (protected and API routes disallowed) and `/sitemap.xml` (public routes) built from one canonical origin in `src/utils/siteUrl.ts`. The root layout publishes WebSite and WebApplication JSON-LD with a current feature list and plain-language title and description. About describes the current journey (reflect, choose, understand, keep it close), replaces generic copy with a short "why it matters", and adds a "Common questions" section with matching FAQPage JSON-LD. Public share pages set a canonical URL.

### M22 — Design polish from review — DONE
- **User value:** fewer dead ends and less friction: a lost link lands somewhere helpful, signing up has no pre-ticked box, and the next step in the questionnaire is always in reach on a phone.
- **Implemented:** a branded `app/not-found.tsx` (noindex) with links home and to the quick start. Sign-in and sign-up show one consent line (`ConsentNote`) covering every method, including Google, instead of a pre-checked terms checkbox. `JourneyActions` pins the questionnaire and quick-start actions above the bottom nav on phones (or the screen edge for guests) and leaves desktop unchanged. The cookie banner positions itself above the phone nav and any pinned action bar (`data-mobile-nav`, `data-bottom-bar` rules in `globals.css`) so it never covers the next step.

### M23 — Quality pass (app-eval until-100) — DONE
- **User value:** faster first load, accessible questionnaires, honest share pages, and safer data handling.
- **Implemented:** Firestore/Storage SDKs load on first use (landing and quick start 236/254 KB gzip first-load JS, budget 300 KB); circle text colors meet 4.5:1 (`ink` shades); public pages show the statement baked into the card (`ikigaiCardStatement`) and owners see when their card is out of date; "Clear ideas" keeps the shortlist and current choice; the image download proxy accepts only the app's bucket; React Doctor 100; production `npm audit` 0. Tests now cover route-handler and server-action authorization, Firestore/Storage rules on the emulators (CI job), account deletion, and `env.sample` drift.
- **Follow-up (2026-10-22):** text moved from `gpt-4o` (API shutdown 2027-01-14) to `gpt-6.1-sol` and card backgrounds from deprecated Fireworks SDXL to OpenAI `gpt-image-2.5-flare`, both verified with live calls. Signed-in end-to-end checks on a test account then found and fixed a share-link overflow on phones, a hydration mismatch in share links, late writes after sign-out, edits lost between two open tabs (saves now merge per question onto the latest answers), and focused controls hidden behind pinned bars (scroll padding). Still open: production monitoring.

### Out of scope / non-goals (for now)

- Distributed rate limiting (Redis) — only needed once multi-instance scale is real; revisit after M1.
- New major product directions unsupported by the current app (teams, payments, coaching marketplace, etc.).
- Large structural refactors or test-suite build-outs as standalone initiatives — add tests with the features they cover.
