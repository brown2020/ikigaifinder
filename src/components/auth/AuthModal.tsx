"use client";

import React, { useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { useAuthStore } from "@/zustand";
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuthActions } from "@/hooks/useAuthActions";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SocialLogin from "./SocialLogin";
import AuthPending from "./AuthPending";
import SignedInView from "./SignedInView";

export default function AuthModal() {
  const { isOpen, closeModal } = useAuthModal();
  const { uid, authPending } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
        setError("");
        setActiveTab("signin");
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeModal]);

  // Close if user logs in
  useEffect(() => {
    if (uid) closeModal();
  }, [uid, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-[999]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          closeModal();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative z-[1000]"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Close modal"
        >
          <XIcon size={20} className="text-gray-500 hover:text-gray-700" />
        </button>

        {uid ? (
          <SignedInView onClose={closeModal} />
        ) : authPending ? (
          <AuthPending onReset={() => {/* logic to reset pending state if needed */}} />
        ) : (
          <div className="w-full">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    {error}
                </div>
            )}

            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === "signin"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === "signup"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Sign Up
              </button>
            </div>

            <SocialLogin onSuccess={closeModal} />

            {activeTab === "signin" ? (
              <LoginForm onSuccess={closeModal} />
            ) : (
              <SignupForm onSuccess={closeModal} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

