import React from "react";
import { PulseLoader } from "react-spinners";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthStore } from "@/zustand";

export default function AuthPending({ onReset }: { onReset: () => void }) {
  const { signOut } = useAuthActions();
  const { authEmail } = useAuthStore();

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl text-center text-gray-900">Signing you in</div>
      <div className="flex flex-col gap-3 border rounded-md px-3 py-2 bg-gray-50">
        <div className="text-gray-900">
          {`Check your email at ${authEmail} for a message from Ikigai Finder`}
        </div>
        <div className="text-gray-900">{`If you don't see the message, check your spam folder. Mark it "not spam" or move it to your inbox.`}</div>
        <div className="text-gray-900">
          Click the sign-in link in the message to complete the sign-in process.
        </div>
        <div className="text-gray-900 flex items-center gap-2">
          Waiting for you to click the sign-in link.
          <PulseLoader color="#000000" size={6} />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => {
             // In the original code, this just resets state in the parent. 
             // Here we need to communicate back or reset local store state if necessary.
             // For now, we assume onReset handles the UI switch.
             onReset();
             window.location.reload(); // Simplest way to clear pending state if it's in store persisted
          }}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Try Different Method
        </button>
        <button
          onClick={() => signOut(onReset)}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}


