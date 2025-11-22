import React from "react";
import Image from "next/image";
import { useAuthActions } from "@/hooks/useAuthActions";
import { isIOSReactNativeWebView } from "@/utils/platform";

export default function SocialLogin({ onSuccess }: { onSuccess: () => void }) {
  const { signInWithGoogle, isLoading } = useAuthActions();
  const showGoogleSignIn = !isIOSReactNativeWebView();

  if (!showGoogleSignIn) return null;

  return (
    <>
      <button
        type="button"
        className="w-full mb-4 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => signInWithGoogle(onSuccess)}
        disabled={isLoading}
      >
        <Image
          src="/assets/google_ctn.svg"
          alt="Continue with Google"
          className="w-full h-auto"
          width={189}
          height={40}
        />
      </button>
      <div className="flex items-center justify-center w-full mb-6">
        <hr className="flex-1 h-px bg-gray-300 border-0" />
        <span className="px-4 text-gray-500 text-sm">or</span>
        <hr className="flex-1 h-px bg-gray-300 border-0" />
      </div>
    </>
  );
}


