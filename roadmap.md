# Roadmap

What is next after the product described in [`spec.md`](./spec.md). Shipped milestones stay in that spec.

## Next

1. **Cover long image generations on the host plan.** `generateImage` waits up to 120 seconds for the provider and does not set `maxDuration`. Next.js uses the platform default, which depends on the Vercel plan. Confirm the production function can outlive that wait, and set `maxDuration` only if the plan allows it.
2. **Decide what to do with covers minted before media URLs.** New images are served from `/api/media`. Signed URLs already issued stay valid until the object is deleted or the signing key is rotated. Rotation is a Steve decision; this repo does not rotate keys.
3. **Engines field for Node 24.** CI and Vercel already run Node 24, and `@firebase/*` declares `node: >=24.12.0`. This repo still has no `engines` field, so a Node 22 install only warns `EBADENGINE`. Add `engines` when we want that warning to become a hard refusal.
4. **TypeScript 7 when the compiler API exists.** ESLint is on ^10.14.0. TypeScript stays on 6.0.3 because 7.0.2 has no compiler API `typescript-eslint` can use; the parser throws and lint crashes.
5. **Browser coverage for sign-in, the nonce CSP, and image upload.** Unit tests cover redirects, session clearing, media authorization, and names. A signed-in browser pass still needs Firebase credentials that are not in this environment.

## Known limits

- Quotas live in Firestore (`_rateLimits`) and fail closed if that read fails. They are not a global budget across every user.
- The in-memory rate-limit helper remains for unit tests only.
- Account deletion removes `_rateLimits/ai:{uid}` and `_rateLimits/img:{uid}` along with the user's other documents. Rules for those paths are owner-denied and must be deployed with `firestore.rules` when that file changes.
- Google sign-in is hidden inside the React Native webview. Email and email-link sign-in stay available.
- `npm audit` and `npm audit --omit=dev` are clean as of this pass (Node 24.22). `minimatch` is overridden to ^11.0.4 and `glob` to ^14.0.3. The `jwks-rsa` → `jose` 5.10.0 pin stays, because `jose` 6 is ESM-only and `firebase-admin/auth` fails to load it on Vercel. Re-check after the next dependency update.

## Open issues

No open product bugs are tracked in this repo beyond the limits above. Profile sign-out now finishes Firebase sign-out and cookie removal before leaving, and the profile card uses the person's name rather than an email address.
