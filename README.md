# Ikigai Finder AI

<p align="center">
  <img src="public/assets/Ikigai-Finder.svg" alt="Ikigai Finder Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Discover your life purpose through AI-guided self-discovery</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a>
</p>

---

**Ikigai Finder AI** is a modern web application that helps users discover their _Ikigai_ (生き甲斐) — the Japanese concept of "a reason for being." Through an interactive, AI-powered questionnaire, users receive personalized Ikigai statements with compatibility scores and can generate beautiful, shareable cards.

## Features

- 🎯 **AI-Guided Discovery** — Interactive stepper form powered by GPT-4o generates unique Ikigai statements based on your responses
- 🎨 **Visual Ikigai Cards** — Create shareable images with custom AI-generated backgrounds via Stable Diffusion XL
- 📊 **Compatibility Scores** — See how your Ikigai aligns with Passion, Profession, Vocation, and Mission
- 🔐 **Secure Authentication** — Firebase Auth with Google Sign-In, Email/Password, and Magic Links
- 📱 **Mobile-First Design** — Responsive UI optimized for all devices
- 🌐 **Social Sharing** — Share your Ikigai on Facebook, Twitter, LinkedIn, and Email
- 💾 **Progress Saving** — All your journey data is saved to your profile
- 🛡️ **Privacy-First** — Your data stays in your Firebase account

## Tech Stack

### Core Framework

| Package                                       | Version | Purpose                                             |
| --------------------------------------------- | ------- | --------------------------------------------------- |
| [Next.js](https://nextjs.org/)                | 16.x    | React framework with App Router & Server Components |
| [React](https://react.dev/)                   | 19.x    | UI library                                          |
| [TypeScript](https://www.typescriptlang.org/) | 5.7+    | Type safety                                         |

### Authentication & Backend

| Package                                                        | Version | Purpose                                 |
| -------------------------------------------------------------- | ------- | --------------------------------------- |
| [Firebase](https://firebase.google.com/)                       | 12.x    | Auth, Firestore database, Cloud Storage |
| [Firebase Admin](https://firebase.google.com/docs/admin/setup) | 13.x    | Server-side Firebase operations         |
| [cookies-next](https://github.com/andreizanik/cookies-next)    | 6.x     | Cookie management for auth tokens       |

### AI & Generation

| Package                                                                   | Version | Purpose                           |
| ------------------------------------------------------------------------- | ------- | --------------------------------- |
| [Vercel AI SDK](https://sdk.vercel.ai/)                                   | 5.x     | Streaming AI responses            |
| [@ai-sdk/openai](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) | 2.x     | OpenAI GPT-4o integration         |
| [@ai-sdk/rsc](https://sdk.vercel.ai/docs/ai-sdk-rsc)                      | 1.x     | React Server Components streaming |

### State Management

| Package                                                                     | Version | Purpose                             |
| --------------------------------------------------------------------------- | ------- | ----------------------------------- |
| [Zustand](https://zustand-demo.pmnd.rs/)                                    | 5.x     | Lightweight global state management |
| [react-firebase-hooks](https://github.com/CSFrequency/react-firebase-hooks) | 5.x     | Firebase React hooks                |

### UI Components

| Package                                                                      | Version | Purpose                     |
| ---------------------------------------------------------------------------- | ------- | --------------------------- |
| [Tailwind CSS](https://tailwindcss.com/)                                     | 4.x     | Utility-first CSS framework |
| [Lucide React](https://lucide.dev/)                                          | 0.559+  | Beautiful icon library      |
| [React Hook Form](https://react-hook-form.com/)                              | 7.x     | Performant form handling    |
| [React Hot Toast](https://react-hot-toast.com/)                              | 2.x     | Toast notifications         |
| [React Select](https://react-select.com/)                                    | 5.x     | Advanced select inputs      |
| [React Slick](https://react-slick.neostack.com/)                             | 0.31+   | Carousel/slider component   |
| [React Spinners](https://www.davidhu.io/react-spinners/)                     | 0.17+   | Loading indicators          |
| [React Tooltip](https://react-tooltip.com/)                                  | 5.x     | Tooltips                    |
| [React Share](https://github.com/nygardk/react-share)                        | 5.x     | Social sharing buttons      |
| [React Cookie Consent](https://github.com/Mastermindzh/react-cookie-consent) | 9.x     | GDPR cookie consent banner  |

### Data Visualization

| Package                                     | Version | Purpose                    |
| ------------------------------------------- | ------- | -------------------------- |
| [AnyChart React](https://www.anychart.com/) | 1.4+    | Venn diagram visualization |

### Utilities

| Package                                                                        | Version | Purpose                        |
| ------------------------------------------------------------------------------ | ------- | ------------------------------ |
| [Zod](https://zod.dev/)                                                        | 4.x     | Schema validation              |
| [Lodash](https://lodash.com/)                                                  | 4.x     | Utility functions              |
| [html2canvas](https://html2canvas.hertzen.com/)                                | 1.4+    | Screenshot capture for sharing |
| [react-textarea-autosize](https://github.com/Andarist/react-textarea-autosize) | 8.x     | Auto-resizing textareas        |

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, **pnpm**, or **bun**
- **Firebase Project** with Firestore, Storage, and Authentication enabled
- **OpenAI API Key** for GPT-4o access
- **Fireworks AI API Key** for image generation

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/ikigaifinder.git
   cd ikigaifinder
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp env.sample .env.local
   ```

   Then edit `.env.local` with your actual credentials (see [Environment Variables](#environment-variables)).

4. **Set up Firebase:**

   - Deploy Firestore rules: `firebase deploy --only firestore:rules`
   - Deploy Storage rules: `firebase deploy --only storage:rules`

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Firebase Server (Admin SDK)

```env
# Service Account credentials (from Firebase Console > Project Settings > Service Accounts)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERTS_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
```

### Firebase Client (Public)

```env
# From Firebase Console > Project Settings > General > Your apps
NEXT_PUBLIC_FIREBASE_APIKEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECTID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=123456789
NEXT_PUBLIC_FIREBASE_APPID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENTID=G-XXXXXXX
```

### AI Services

```env
# OpenAI (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-... # Optional

# Fireworks AI (https://fireworks.ai/)
FIREWORKS_API_KEY=fw_...
```

### Application

```env
# Cookie name for auth token storage
NEXT_PUBLIC_COOKIE_NAME=purposefinderAuthToken

# Base URL for metadata (optional, defaults to https://ikigaifinder.ai)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Project Structure

```
ikigaifinder/
├── public/                    # Static assets
│   ├── assets/               # Images, icons, SVGs
│   └── .well-known/          # App association files
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # User dashboard
│   │   ├── generate-ikigai/  # Ikigai generation flow
│   │   ├── ikigai/[id]/      # Shareable ikigai pages
│   │   ├── ikigai-finder/    # Main questionnaire
│   │   ├── profile/          # User profile
│   │   └── ...               # Other pages
│   ├── components/           # React components
│   │   ├── auth/             # Authentication (Modal, Forms)
│   │   ├── ui/               # Reusable UI components
│   │   └── ...               # Feature components
│   ├── componentPages/       # Page-level components
│   ├── constants/            # App constants & questions
│   ├── firebase/             # Firebase client & admin setup
│   ├── hooks/                # Custom React hooks
│   │   ├── use-auth-actions.ts
│   │   ├── use-auth-token.ts
│   │   └── use-ikigai-generator.ts
│   ├── lib/                  # Core libraries
│   │   ├── generateIkigai.ts # AI text generation
│   │   ├── generateImage.ts  # AI image generation
│   │   ├── rateLimit.ts      # Rate limiting
│   │   ├── validation.ts     # Zod schemas
│   │   └── errors.ts         # Custom error classes
│   ├── services/             # Data layer
│   │   ├── ikigaiService.ts
│   │   ├── profileService.ts
│   │   └── userService.ts
│   ├── types/                # TypeScript definitions
│   ├── utils/                # Helper functions
│   └── zustand/              # State management
│       ├── useAuthStore.ts
│       ├── useIkigaiStore.ts
│       ├── useProfileStore.ts
│       └── useUIStore.ts
├── firestore.rules           # Firestore security rules
├── storage.rules             # Storage security rules
├── proxy.ts                  # Next.js 16 middleware (route protection)
└── ...
```

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Authentication** → Enable Google and Email/Password providers
   - **Firestore Database** → Create in production mode
   - **Storage** → Create default bucket

### 2. Get Client Configuration

1. Go to Project Settings → General → Your apps
2. Add a Web app if you haven't already
3. Copy the Firebase config object

### 3. Get Admin SDK Credentials

1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Use the values in your `.env.local`

### 4. Deploy Security Rules

The project includes security rules for both Firestore and Storage:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize (select Firestore and Storage)
firebase init

# Deploy rules
firebase deploy --only firestore:rules,storage:rules
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/)
3. Add all environment variables in Project Settings
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js 16:

- **Netlify** — Use the Next.js runtime
- **AWS Amplify** — SSR support for Next.js
- **Self-hosted** — `npm run build && npm start`

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Security Features

- 🔒 **Route Protection** via Next.js 16 proxy middleware
- 🔐 **Firebase Security Rules** for Firestore and Storage
- 🛡️ **Content Security Policy** headers
- ⚡ **Rate Limiting** on AI endpoints (20 text, 5 image per minute)
- 🧹 **Input Sanitization** for all user inputs
- 🚫 **Content Moderation** for image prompts

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and commit:
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to your fork:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style (Prettier/ESLint)
- Use TypeScript for all new code
- Add proper JSDoc comments for functions
- Use atomic Zustand selectors for performance
- Prefer Server Components where possible

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using Next.js, Firebase, and AI
</p>
