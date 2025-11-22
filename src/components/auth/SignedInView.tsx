import React from "react";
import { useAuthStore } from "@/zustand";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function SignedInView({ onClose }: { onClose: () => void }) {
  const { authDisplayName, authEmail } = useAuthStore();
  const { signOut } = useAuthActions();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl text-center font-semibold">You are signed in</div>
      
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="text-sm text-gray-500">Display Name</div>
          <div className="font-medium">{authDisplayName || "User"}</div>
          
          <div className="text-sm text-gray-500 mt-2">Email</div>
          <div className="font-medium">{authEmail}</div>
      </div>

      <div className="flex gap-3 mt-2">
        <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
            Close
        </button>
        <button 
            onClick={() => signOut(onClose)} 
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
            Sign Out
        </button>
      </div>
    </div>
  );
}


