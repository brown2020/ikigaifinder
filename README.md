# Ikigai Finder AI

Ikigai Finder AI is a modern web application designed to help users discover their "Ikigai" (reason for being) through a guided, AI-powered process. It combines introspection with advanced AI generation to create personalized Ikigai statements and visualizations.

## 🚀 Tech Stack

### Core Framework
- **Next.js 16** (App Router, Server Components)
- **React 19**
- **TypeScript 5.7**

### Authentication & Backend
- **Firebase** (Auth, Firestore, Storage)
- **Firebase Admin SDK**

### State Management
- **Zustand** (Global client state)
- **React Query / Custom Hooks** (Data fetching abstraction)

### AI & Generation
- **Vercel AI SDK** (`ai`, `@ai-sdk/openai`, `@ai-sdk/rsc`)
- **OpenAI GPT-4o** (Text generation)
- **Fireworks AI** (Image generation via Stable Diffusion XL)

### UI/UX
- **Tailwind CSS 4** (Styling)
- **Lucide React** (Icons)
- **React Hook Form** (Form management)
- **React Hot Toast** (Notifications)
- **React Spinners** (Loading states)
- **React Select** (Dropdowns)
- **AnyChart React** (Venn Diagram visualization)
- **React Tooltip** (User guidance)
- **React Slick** (Carousels)

### Utilities
- **html2canvas** (Image capture)
- **Lodash** (Utility functions)
- **Cookies Next** (Cookie management)
- **React Cookie Consent** (GDPR compliance)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ikigaifinder.git
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

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your environment variables:

   ```env
   # Firebase Client Config
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin Config (Service Account)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

   # AI Services
   OPENAI_API_KEY=your_openai_key
   FIREWORKS_API_KEY=your_fireworks_key

   # App Config
   NEXT_PUBLIC_COOKIE_NAME=authToken
   ```

   *Note: For Firebase Admin, you may also use a `service_key.json` file if configured in the code.*

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
/src
  /app              # Next.js App Router pages & API routes
  /components       # Reusable UI components
    /auth           # Authentication components (Modal, Forms)
  /componentPages   # Page-level components (refactored from app directory)
  /context          # React Contexts (e.g., AuthModalContext)
  /firebase         # Firebase client & admin initialization
  /hooks            # Custom React hooks (useAuthActions, useIkigaiGenerator)
  /lib              # Core libraries (AI generation, image generation)
  /services         # Data services (ikigaiService, profileService)
  /types            # TypeScript definitions
  /utils            # Helper functions (canvas, parsing)
  /zustand          # Zustand stores (Auth, Ikigai, Profile)
```

## ✨ Key Features

- **AI-Guided Discovery**: An interactive stepper form that uses GPT-4o to generate unique Ikigai statements based on user inputs.
- **Visual Ikigai Card**: Generates a shareable image with a custom background created via Stable Diffusion XL.
- **Interactive Venn Diagram**: Visualizes the intersection of Passion, Profession, Vocation, and Mission.
- **Secure Authentication**: Full Firebase Auth support including Google Sign-In, Email/Password, and Magic Links.
- **Profile Management**: Users can save and manage their Ikigai history.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source.
