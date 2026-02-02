# CLAUDE.md - Ikigai Finder AI

This file provides guidance for Claude Code when working with this codebase.

## Project Overview

Ikigai Finder AI is a Next.js 16 application that helps users discover their ikigai (Japanese concept of "reason for being") through AI-guided surveys and personalized recommendations.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.7
- **UI:** React 19, Tailwind CSS 4.0
- **State:** Zustand 5.0 with devtools
- **Auth/DB:** Firebase (Auth, Firestore, Storage)
- **AI:** OpenAI GPT-4o via Vercel AI SDK, Fireworks AI for image generation
- **Forms:** React Hook Form + Zod validation

## Project Structure

```
src/
├── proxy.ts               # Next.js 16 route protection
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # API routes (auth, images, sharing)
│   ├── dashboard/         # User dashboard (with loading.tsx, error.tsx)
│   ├── generate-ikigai/   # Main ikigai generation flow (with loading.tsx, error.tsx)
│   ├── ikigai/[id]/       # Dynamic ikigai detail pages
│   └── profile/           # User profile management (with loading.tsx, error.tsx)
├── components/            # React components
│   ├── ui/               # Base UI components (Button, Card, Input, etc.)
│   └── auth/             # Authentication components
├── firebase/              # Firebase client & admin configuration
├── hooks/                 # Custom React hooks
├── lib/                   # Core utilities
│   ├── ai/               # AI streaming utilities
│   ├── auth/             # Session management
│   ├── generateIkigai.ts # Server action for AI generation
│   ├── generateImage.ts  # Server action for image generation
│   ├── rateLimit.ts      # Rate limiting (with cleanup function for proper shutdown)
│   └── validation.ts     # Zod schemas & sanitization
├── zustand/               # State management stores (with race condition protection)
├── services/              # Business logic (ikigaiService, profileService)
├── constants/             # Questions, system prompts, menu config
├── utils/                 # Utility functions
│   └── downloadImage.ts  # Shared image download utility
└── types/                 # TypeScript definitions
```

## Key Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## State Management

Four Zustand stores in `src/zustand/`:

- **useAuthStore** - User authentication state (uid, email, displayName, etc.)
- **useIkigaiStore** - Ikigai journey data (answers, options, selected, guidance, images)
- **useProfileStore** - User profile information
- **useUIStore** - Global UI state (modals, loading states)

## Firebase Collections

```
ikigaiUsers/{uid}/
├── ikigai/main          # User's ikigai data
└── covers/              # Generated image history

ikigaiProfiles/{uid}/    # User profile data
```

## AI Integration

- **Ikigai Generation:** `src/lib/generateIkigai.ts` - Server action using GPT-4o
- **Image Generation:** `src/lib/generateImage.ts` - Server action using Fireworks AI (SDXL)
- **Streaming Hook:** `src/hooks/use-ikigai-generator.ts` - Client-side streaming UI
- **System Prompts:** `src/constants/systemPrompt.ts`

## API Routes

- `POST /api/auth/session` - Create session cookie from Firebase token
- `DELETE /api/auth/session` - Clear session on logout
- `GET /api/downloadImage` - Proxy image downloads (CORS handling)
- `PATCH /api/ikigai/sharing` - Update sharing settings

## Environment Variables

Required in `.env.local`:
```
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_PRIVATE_KEY
FIREBASE_ADMIN_CLIENT_EMAIL

# AI Services
OPENAI_API_KEY
FIREWORKS_API_KEY
```

## Code Patterns

### Server Actions
Located in `src/lib/`. Use `"use server"` directive. Include rate limiting and Zod validation.

### Form Validation
Use Zod schemas from `src/lib/validation.ts`. Always sanitize user input before AI processing.

### Authentication
Use `useAuthStore` for client-side auth state. Session cookies managed via `/api/auth/session`.

### Component Imports
Use path alias: `import { Button } from '@/components/ui/Button'`

## Security Considerations

- All user input is validated with Zod schemas and sanitized before AI processing
- Rate limiting on AI generation endpoints (per-user tracking)
- HTTP-only session cookies with server-side verification
- CSP headers configured in `next.config.mjs`
- Image proxy validates domains against whitelist

## Testing

No test framework currently configured. Consider adding Vitest or Jest for unit tests.

## Deployment Notes

- React Strict Mode disabled in `next.config.mjs` (library compatibility)
- Server action body limit set to 2MB
- Image optimization configured for Firebase Storage domains
