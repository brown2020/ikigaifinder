# Ikigai Finder AI

Discover your *ikigai* (生き甲斐 — “a reason for being”) through an AI-guided questionnaire. Answer structured prompts, get scored ikigai statements (Passion, Profession, Vocation, Mission), generate an illustration, and share a card. Live at [https://ikigaifinder.ai](https://ikigaifinder.ai).

> Product as built: [`spec.md`](./spec.md). What to do next: [`roadmap.md`](./roadmap.md). Agent conventions: [`AGENTS.md`](./AGENTS.md).

## Features

- Guided questionnaire (`/ikigai-finder`) and a four-question quick start (`/ikigai-finder/quick`). Guests can answer before signing up; answers move into the account on first sign-in.
- Streamed generation of personalized ikigai statements with compatibility scores, plus a written insights report
- Card designer with an AI cover, cover history, and extra download sizes (square, story, wide)
- Public share page (`/ikigai/[id]`), social share, and image download. Images are served from this site only to the owner or while the card is public
- Dashboard to resume, check in, and run a short experiment from the report
- Profile: photo, name, and contact email. Sign-out clears the session
- Account deletion from the profile page
- Firebase auth — Google (hidden inside the React Native app), email/password, and passwordless email link
- Cookie consent and legal pages (privacy, terms, about, support)

## Tech stack

| Layer | Tech |
| --- | --- |
| Runtime | Node.js 22+ |
| Framework | Next.js ^16.4.3 (App Router) |
| UI | React ^19.3.1, Tailwind CSS ^4.3.3, Lucide, html2canvas, react-share |
| Language | TypeScript ^6.0.3 |
| State | Zustand ^5.0.16 |
| Forms | React Hook Form ^7.91 + Zod ^4.6 |
| Backend | Firebase ^13.1.0 + Firebase Admin ^14.5.0 |
| AI text | Vercel AI SDK (`ai` ^7.0.156) + `@ai-sdk/openai` ^4 + `@ai-sdk/rsc` ^3 streaming |
| AI images | OpenAI image generation through the AI SDK (`IMAGE_MODEL` in `src/constants/ai.ts`) |
| Tests / quality | Vitest ^5.0.5, ESLint ^9.39.5, React Doctor |

No Stripe or other payments in this app. Model IDs live only in `src/constants/ai.ts`.

## Project structure

```
src/
  app/
    api/account/           # Delete the caller's account and all data
    api/auth/session/      # Session cookie create/clear
    api/downloadImage/     # Authorized download of a stored image
    api/media/             # Authorized image bytes (owner or public cover)
    api/ikigai/sharing/    # Toggle public sharing
    ikigai-finder/         # Questionnaire (+ quick/)
    generate-ikigai/       # Ideas, report, card
    ikigai/[id]/           # Public share page
    dashboard/ profile/    # Hub + account
  lib/                     # Server actions: generateIkigai, generateReport, generateImage
  components/              # journey, ikigai, share, auth, layout, ui
  firebase/ zustand/ utils/
  proxy.ts                 # Session check and per-request content security policy
firestore.rules  storage.rules  firebase.json  env.sample
```

## Getting started

### Prerequisites

- Node.js 22+
- npm
- A Firebase project with Auth, Firestore, and Storage
- An OpenAI API key

### Install

```bash
git clone https://github.com/brown2020/ikigaifinder.git
cd ikigaifinder
cp env.sample .env.local
# Fill in the names below — never commit real secrets
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Deploy `firestore.rules` and `storage.rules` with the Firebase CLI when those files change. The website deploy does not publish rules.

## Environment variables

Names only. Copy `env.sample` to `.env.local` and fill values there. There is no `.env.example`.

| Name | Purpose |
| --- | --- |
| `FIREBASE_TYPE` | Admin credential type |
| `FIREBASE_PROJECT_ID` | Admin project id |
| `FIREBASE_PRIVATE_KEY_ID` | Admin private key id |
| `FIREBASE_PRIVATE_KEY` | Admin private key |
| `FIREBASE_CLIENT_EMAIL` | Admin client email |
| `FIREBASE_CLIENT_ID` | Admin client id |
| `FIREBASE_AUTH_URI` | Admin auth URI |
| `FIREBASE_TOKEN_URI` | Admin token URI |
| `FIREBASE_AUTH_PROVIDER_X509_CERT_URL` | Admin cert URL |
| `FIREBASE_CLIENT_CERTS_URL` | Admin client certs URL |
| `FIREBASE_UNIVERSE_DOMAIN` | Admin universe domain |
| `NEXT_PUBLIC_FIREBASE_APIKEY` | Client API key |
| `NEXT_PUBLIC_FIREBASE_AUTHDOMAIN` | Client auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECTID` | Client project id |
| `NEXT_PUBLIC_FIREBASE_STORAGEBUCKET` | Client storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID` | Client messaging sender id |
| `NEXT_PUBLIC_FIREBASE_APPID` | Client app id |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENTID` | Client measurement id |
| `OPENAI_API_KEY` | Statements, reports, and cover images |
| `FIREBASE_SESSION_COOKIE_NAME` | Optional session cookie name |
| `FIREBASE_SESSION_EXPIRES_DAYS` | Optional session lifetime in days |
| `COOKIE_SECURE` | Optional secure-cookie override |
| `NEXT_PUBLIC_BASE_URL` | Optional public origin for links and metadata |

`NODE_ENV`, `VERCEL`, and `VERCEL_URL` are set by the platform. `src/envSample.test.ts` fails if code reads a name that `env.sample` does not list, or if `env.sample` lists a name nothing reads.

The app still builds when Firebase admin credentials are absent. Authenticated and AI features need the variables above in the host.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (includes type-checking) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit and route-handler tests |
| `npm run test:rules` | Firestore and Storage rules on the local emulators (Java 21) |
| `npm run doctor` | React Doctor |
| `node scripts/smoke-hosted.mjs` | Read-only production probes |

## Testing and CI

GitHub Actions on `dev` and `main` runs lint, typecheck, unit tests, React Doctor, the production build, and the rules emulators. A separate workflow scans for malware. Production smoke runs after a production deployment.

## Deployment

The site is hosted on Vercel (project `ignitechannel/ikigaifinder`). Set the same environment variable names in the host. Do not put secret values in workflow files. Promoting `dev` to `main` is a separate step after QA. A website rollback does not roll back Firestore or Storage rules.

## Contributing

Work on `dev`. See [`AGENTS.md`](./AGENTS.md). Run lint, typecheck, tests, and the production build before pushing.

## License

GNU Affero General Public License v3.0 — see [LICENSE.md](LICENSE.md).
