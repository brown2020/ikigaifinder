# Roadmap

What is next after the product described in [`spec.md`](./spec.md). Shipped milestones stay in that spec.

## Next

1. **Cover long image generations on the host plan.** `generateImage` waits up to 120 seconds for the provider and does not set `maxDuration`. Next.js uses the platform default, which depends on the Vercel plan. Confirm the production function can outlive that wait, and set `maxDuration` only if the plan allows it.
2. **Decide what to do with covers minted before media URLs.** New images are served from `/api/media`. Signed URLs already issued stay valid until the object is deleted or the signing key is rotated. Rotation is a Steve decision; this repo does not rotate keys.
3. **Node 24 when we leave Node 22.** `@firebase/*` packages declare `node: >=24.12.0`. CI and production builds still run on Node 22, where those packages load and warn `EBADENGINE`. Do not bump engines until that move is intentional.
4. **ESLint 10 and TypeScript 7 when peers allow them.** `eslint-plugin-react`, `eslint-plugin-import`, and `eslint-plugin-jsx-a11y` still stop at ESLint 9. `typescript-eslint` still requires TypeScript `<6.1`. Stay on ESLint ^9.39.5 and TypeScript ^6.0.3 until those ranges move.
5. **Browser coverage for sign-in, the nonce CSP, and image upload.** Unit tests cover redirects, session clearing, media authorization, and names. A signed-in browser pass still needs Firebase credentials that are not in this environment.

## Known limits

- Quotas live in Firestore (`_rateLimits`) and fail closed if that read fails. They are not a global budget across every user.
- The in-memory rate-limit helper remains for unit tests only.
- Account deletion removes `_rateLimits/ai:{uid}` and `_rateLimits/img:{uid}` along with the user's other documents. Rules for those paths are owner-denied and must be deployed with `firestore.rules` when that file changes.
- Google sign-in is hidden inside the React Native webview. Email and email-link sign-in stay available.
- `npm audit` (including production-only) is clean as of this pass. Re-check after the next dependency update.

## Open issues

No open product bugs are tracked in this repo beyond the limits above. Profile sign-out now finishes Firebase sign-out and cookie removal before leaving, and the profile card uses the person's name rather than an email address.
