# Ikigai Finder AI

Discover your *ikigai* (生き甲斐 — “a reason for being”) through an AI-guided questionnaire. Answer structured prompts, get scored ikigai statements (Passion, Profession, Vocation, Mission), generate an illustration, and share a card. Live at [https://ikigaifinder.ai](https://ikigaifinder.ai).

> Product scope: [`spec.md`](./spec.md). Agent conventions: [`AGENTS.md`](./AGENTS.md).

## Features

- Guided questionnaire (`/ikigai-finder`) with a quick-start path (`/ikigai-finder/quick`); guests can answer before signing up
- Streamed GPT-4o generation of personalized ikigai statements with compatibility scores
- Insights report and card designer (`/generate-ikigai`, `/report`, `/card`)
- AI cover image via Fireworks Stable Diffusion XL → Firebase Storage
- Shareable public page (`/ikigai/[id]`), social share, and image download
- Dashboard / profile (“My ikigai”) with resume and sharing controls
- Firebase auth — Google, email/password, passwordless email link
- Cookie consent and legal pages (privacy, terms, about, support)

## Tech stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js ^16.3.6 (App Router) |
| UI | React ^19.2.7, Tailwind CSS ^4.3.2, Lucide, html2canvas, react-share |
| Language | TypeScript ^6.0.3 |
| State | Zustand ^5.0.14 |
| Forms | React Hook Form ^7.81 + Zod ^4.4.3 |
| Backend | Firebase ^12.16.0 + Firebase Admin ^14.1.0 |
| AI text | Vercel AI SDK (`ai` ^7) + `@ai-sdk/openai` ^4 + `@ai-sdk/rsc` streaming |
| AI images | Fireworks REST (SDXL) |
| Tests / quality | Vitest ^5.0.1, ESLint 9, React Doctor |

No Stripe / payments in this app.

## Project structure

```
src/
  app/
    api/auth/session/      # Session cookie create/clear
    api/downloadImage/     # Image download proxy
    api/ikigai/sharing/    # Toggle public sharing
    ikigai-finder/         # Questionnaire (+ quick/)
    generate-ikigai/       # Ideas, report, card
    ikigai/[id]/           # Public share page
    dashboard/ profile/    # Hub + account
  lib/                     # Server actions: generateIkigai, generateReport, generateImage
  components/              # journey, ikigai, share, auth, layout, ui
  firebase/ zustand/ utils/
  proxy.ts                 # Session-cookie route protection
firestore.rules  storage.rules  env.sample
```

## Getting started

### Prerequisites

- Node.js 22+
- npm
- Firebase project (Auth, Firestore, Storage)
- OpenAI API key
- Fireworks API key (for images)

### Install

```bash
git clone https://github.com/brown2020/ikigaifinder.git
cd ikigaifinder
cp env.sample .env.local
# Replace placeholders — never commit real secrets
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Deploy `firestore.rules` and `storage.rules` to Firebase for production-like security.

## Environment variables

Documented in `env.sample` (there is no `.env.example`).

| Name | Purpose | Where to get it |
| --- | --- | --- |
| `FIREBASE_*` | Admin SDK service account fields | Firebase Console → Service accounts |
| `NEXT_PUBLIC_FIREBASE_*` | Client Firebase config | Firebase Console → Project settings |
| `OPENAI_API_KEY` | GPT-4o ikigai + report generation | [platform.openai.com](https://platform.openai.com) |
| `OPENAI_ORG_ID` | Optional OpenAI org | Same |
| `FIREWORKS_API_KEY` | SDXL image generation | [fireworks.ai](https://fireworks.ai) |
| `NEXT_PUBLIC_COOKIE_NAME` | Auth cookie name used by proxy | Choose a stable name (e.g. `ikigaiAuthToken`) |
| `NEXT_PUBLIC_BASE_URL` | Optional public site URL for metadata / OG | Your production URL |
| `FIREBASE_SESSION_COOKIE_NAME` / `FIREBASE_SESSION_EXPIRES_DAYS` / `COOKIE_SECURE` | Optional session cookie overrides (used in code) | Tune as needed |

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run doctor` | React Doctor |

## Testing and CI

- Vitest unit tests.
- `.github/workflows/ci.yml` on `dev` / `main`: lint → typecheck → test → React Doctor → build (client env from Actions secrets).
- Malware IOC scan workflow is also present.

## Deployment

Designed for Vercel. Set the same env vars in the host. Do not inline secrets in workflow YAML.

## Contributing

Branch from `dev`. See [`AGENTS.md`](./AGENTS.md). Run lint, typecheck, and tests before opening a PR.

## License

GNU Affero General Public License v3.0 — see [LICENSE.md](LICENSE.md).
