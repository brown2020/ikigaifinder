# Ikigai Finder - Codebase Improvement Plan

This document outlines specific findings and recommendations for improving the codebase, organized by priority.

**Last Updated:** February 2026

---

## COMPLETED IMPROVEMENTS

The following critical and important issues have been addressed:

### Critical (All Fixed)

1. **Race Conditions in Zustand Stores** - Fixed in `useIkigaiStore.ts` and `useProfileStore.ts`. Added UID verification before setting state after async operations.

2. **Proxy.ts Location** - Verified `src/proxy.ts` is correctly located for Next.js 16 route protection.

3. **Session Clear Error Handling** - Fixed in `use-auth-token.ts`. Now logs errors instead of silently swallowing them.

4. **Rate Limiter Improvements** - Added production warning for multi-instance deployments and `cleanupRateLimiter()` function to prevent memory leaks.

5. **Stale Closure in useIkigaiGenerator** - Added `isMountedRef` to prevent state updates after component unmount.

### Important (Completed)

6. **Error/Loading Boundaries** - Added `error.tsx` and `loading.tsx` for dashboard, generate-ikigai, and profile routes.

7. **Dead Code Removal** - Removed unused exports from:
   - `ikigaiParser.ts` - Removed `calculateAverageScore()`, `sortByCompatibility()`
   - `platform.ts` - Removed `isMobile()`, `isTouchDevice()`, `isServer()`, `isBrowser()`
   - `validation.ts` - Removed `validateOrThrow()`, `validateSafe()`, `sanitizeInputArray()`
   - `errors.ts` - Removed unused error classes and type guards
   - `systemPrompt.ts` - Removed commented-out code

8. **UI Inconsistencies** - Fixed CSS typo (`outline-hidden` → `outline-none`) and invalid breakpoint (`xs:` → `sm:`).

9. **Accessibility** - Added `aria-label` to close buttons, `aria-live="polite"` to error messages, focus visible states to buttons.

10. **Firestore Error Propagation** - Fixed in `profileService.ts` to properly handle and propagate errors when creating new profiles.

11. **Duplicate Code** - Extracted image download logic to `src/utils/downloadImage.ts`.

12. **Unused Dependencies** - Removed `@types/lodash` from package.json.

---

## REMAINING NICE-TO-HAVE IMPROVEMENTS

### 13. Directory Structure Improvements

**Current structure is functional but could be organized by domain:**

```
Recommended:
src/components/
├── ui/           # Primitive components (Button, Input, Card)
├── forms/        # Form-related components
├── auth/         # Authentication components
├── ikigai/       # Ikigai-specific components
├── layout/       # Navbar, Footer, BottomBar
├── home/         # Homepage sections
├── profile/      # Profile components
└── shared/       # Shared utilities
```

---

### 14. Large Components to Split

**Files that could be split for better maintainability:**

| File | Lines | Could Split Into |
|------|-------|-----------|
| `src/components/GenerateIkigaiForm.tsx` | 341 | Form wrapper, OptionsDisplay, SelectionPanel |
| `src/components/GenerateIkigaiImage.tsx` | 305 | Generation logic, Preview, Actions |
| `src/hooks/use-auth-actions.ts` | 338 | google-auth, email-auth, password-reset |
| `src/components/auth/AuthForm.tsx` | 290 | Form wrapper, EmailPasswordForm |

---

### 15. Potentially Unused Components

These components may not be actively used. Verify and remove if unused:

- `src/components/GenerateImage.tsx`
- `src/components/ImageSelector.tsx`
- `src/components/PurposeSurvey.tsx`
- `src/components/RenderIkigaiDetails.tsx`
- `src/components/SVGOverlay.tsx`
- `src/components/SurveyQuestion.tsx`
- `src/components/VennDiagram.tsx`

---

### 16. Legal Pages Need Date Update

**Issue:** Privacy Policy and Terms of Service last updated November 1, 2022.

**Files:**
- `src/app/privacy-policy/page.tsx`
- `src/app/terms-conditions/page.tsx`

**Fix:** Review and update for current compliance requirements.

---

### 17. Production Rate Limiting

For production multi-instance deployments, the in-memory rate limiter should be replaced with Redis or another distributed solution. A warning is now logged in production.

---

## Summary

| Priority | Original Count | Completed | Remaining |
|----------|---------------|-----------|-----------|
| Critical | 5 | 5 | 0 |
| Important | 7 | 7 | 0 |
| Nice-to-have | 6 | 1 | 5 |

---

## Security Checklist

- [x] Firestore rules properly configured (owner-based access)
- [x] Storage rules properly configured (user-scoped paths)
- [x] Session cookies use httpOnly, secure, sameSite
- [x] Input validation with Zod schemas
- [x] Input sanitization before AI processing
- [x] Rate limiting on expensive operations
- [x] service_key.json in .gitignore
- [x] proxy.ts in src folder
- [x] Session clear errors logged
- [ ] Implement distributed rate limiting for production (nice-to-have)
