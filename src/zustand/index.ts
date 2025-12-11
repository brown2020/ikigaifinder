/**
 * Centralized Zustand stores exports
 */

// Store hooks
export {
  useAuthStore,
  selectUser,
  selectAuthStatus,
  selectSubscription,
} from "./useAuthStore";
export {
  useProfileStore,
  selectProfile,
  selectProfileUser,
  selectFormattedName,
} from "./useProfileStore";
export {
  useIkigaiStore,
  defaultIkigai,
  selectIkigaiData,
  selectSelectedIkigai,
  selectIsComplete,
} from "./useIkigaiStore";
export {
  useUIStore,
  selectIsAuthModalOpen,
  selectOpenAuthModal,
  selectCloseAuthModal,
  selectIsGlobalLoading,
  selectSetGlobalLoading,
} from "./useUIStore";

// Store initialization
export { useInitializeStores } from "./useInitializeStores";

// Types
export type { AuthState } from "./useAuthStore";
