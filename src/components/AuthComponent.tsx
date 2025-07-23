"use client";

import { useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import Image from "next/image";
import { LockIcon, MailIcon, XIcon } from "lucide-react";
import { PulseLoader } from "react-spinners";
import { useAuthStore } from "@/zustand";
import { auth } from "@/firebase/firebaseClient";

import Link from "next/link";
import { isIOSReactNativeWebView } from "@/utils/platform";

interface AuthComponentT {
  isOpenModal: boolean;
  onCloseModal: () => void;
}

export default function AuthComponent({
  isOpenModal,
  onCloseModal,
}: AuthComponentT) {
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);
  const clearAuthDetails = useAuthStore((s) => s.clearAuthDetails);
  const uid = useAuthStore((s) => s.uid);
  const authEmail = useAuthStore((s) => s.authEmail);
  const authDisplayName = useAuthStore((s) => s.authDisplayName);
  const authPending = useAuthStore((s) => s.authPending);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(true);
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isEmailLinkLogin, setIsEmailLinkLogin] = useState(false);
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(true);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Hide Google Sign-In button and the divider if in a React Native WebView on iOS
    setShowGoogleSignIn(!isIOSReactNativeWebView());
  }, []);

  // Clear error message when switching tabs
  useEffect(() => {
    setError('');
  }, [activeTab]);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onCloseModal();
    } catch (error: unknown) {
      // Handle popup cancellation errors silently
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/popup-closed-by-user' || firebaseError.code === 'auth/cancelled-popup-request') {
        // Don't show any error message for user cancellation
        return;
      }
      
      // Handle all other errors
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      onCloseModal();
    }
  }, [onCloseModal, uid]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      clearAuthDetails();
    } catch {
      alert("An error occurred while signing out.");
    } finally {
      onCloseModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const actionCodeSettings = {
      url: `${window.location.origin}/loginfinish`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("ikigaiFinderEmail", email);
      window.localStorage.setItem("ikigaiFinderName", name);
      setAuthDetails({ authPending: true });
    } catch (error: unknown) {
      // Handle specific Firebase errors directly - NO console logging
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/quota-exceeded') {
        setError('Daily email sign-in limit exceeded. Please try again tomorrow or use a different sign-in method.');
        return;
      }
      
      if (firebaseError.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
        return;
      }
      
      if (firebaseError.code === 'auth/user-disabled') {
        setError('This account has been disabled.');
        return;
      }
      
      if (firebaseError.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
        return;
      }
      
      // Handle all other errors silently with generic message
      setError('An error occurred sending the sign-in link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.localStorage.setItem("generateEmail", email);
      window.localStorage.setItem("generateName", email.split("@")[0]);
      onCloseModal();
    } catch (error: unknown) {
      // Handle specific Firebase errors directly - NO console logging
      const firebaseError = error as { code?: string; message?: string };
      
      // Firebase v9+ uses 'auth/invalid-credential' for both wrong password and user not found
      if (firebaseError.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials and try again.');
        return;
      }
      
      // Legacy error codes (still check for backwards compatibility)
      if (firebaseError.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
        return;
      }
      
      if (firebaseError.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
        return;
      }
      
      if (firebaseError.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
        return;
      }
      
      if (firebaseError.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
        return;
      }
      
      if (firebaseError.code === 'auth/user-disabled') {
        setError('This account has been disabled.');
        return;
      }
      
      // Handle all other errors silently with generic message
      setError('An error occurred during sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.localStorage.setItem("generateEmail", email);
      window.localStorage.setItem("generateName", email.split("@")[0]);
      onCloseModal();
    } catch (error: unknown) {
      // Handle specific Firebase errors directly - NO console logging
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please use the Sign In tab instead.');
        return;
      }
      
      if (firebaseError.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
        return;
      }
      
      if (firebaseError.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
        return;
      }
      
      if (firebaseError.code === 'auth/user-disabled') {
        setError('This account has been disabled.');
        return;
      }
      
      if (firebaseError.code === 'auth/operation-not-allowed') {
        setError('Email/password accounts are not enabled.');
        return;
      }
      
      // Handle all other errors silently with generic message
      setError('An error occurred during sign-up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email to reset your password.");
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setError(''); // Clear any previous errors
      // Show success message (you might want to add a success state)
      alert(`Password reset email sent to ${email}`);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error: unknown) => {
    
    // Handle Firebase errors
    if (isFirebaseError(error)) {
      // Provide user-friendly error messages
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setError('An account with this email already exists. Please use the Sign In tab instead.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters long.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid credentials. Please check your email and password.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.');
          break;
        case 'auth/popup-closed-by-user':
          // Don't show error for user-cancelled popup - this is expected behavior
          console.log('Google sign-in popup was closed by user');
          return; // Exit early without setting error
        case 'auth/cancelled-popup-request':
          // Don't show error for cancelled popup
          console.log('Google sign-in popup was cancelled');
          return; // Exit early without setting error
        default:
          setError(error.message || 'An unexpected error occurred. Please try again.');
      }
    } else if (error && typeof error === 'object' && 'code' in error) {
      // Handle other error objects that might have a code property
      const errorCode = (error as { code?: string }).code;
      if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
        return; // Exit early without setting error
      }
      setError('An unexpected error occurred. Please try again.');
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCloseModal();
      }
    };

    if (isOpenModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenModal, onCloseModal]);

  return (
    <>
      {isOpenModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 999 }}
          onClick={(e) => {
            if (
              modalRef.current &&
              !modalRef.current.contains(e.target as Node)
            ) {
              onCloseModal();
            }
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative"
            style={{ zIndex: 1000 }}
          >
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <XIcon size={20} className="text-gray-500 hover:text-gray-700" />
            </button>
            {uid ? (
              <div className="flex flex-col gap-2">
                <div className="text-2xl text-center">You are signed in</div>
                <div className="input-disabled">{authDisplayName}</div>
                <div className="input-disabled">{authEmail}</div>
                <button onClick={handleSignOut} className="btn-danger">
                  Sign Out
                </button>
              </div>
            ) : authPending ? (
              <div className="flex flex-col gap-2">
                <div className="text-2xl text-center text-gray-900">Signing you in</div>
                <div className="flex flex-col gap-3 border rounded-md px-3 py-2 bg-gray-50">
                  <div className="text-gray-900">
                    {`Check your email at ${email} for a message from Ikigai Finder`}
                  </div>
                  <div className="text-gray-900">{`If you don't see the message, check your spam folder. Mark it "not spam" or move it to your inbox.`}</div>
                  <div className="text-gray-900">
                    Click the sign-in link in the message to complete the
                    sign-in process.
                  </div>
                  <div className="text-gray-900">
                    Waiting for you to click the sign-in link.{" "}
                    <span>
                      {" "}
                      <PulseLoader color="#000000" size={6} />
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setIsEmailLinkLogin(false);
                      setEmail('');
                      setError('');
                    }} 
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Try Different Method
                  </button>
                  <button onClick={handleSignOut} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Start Over
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                {/* Error Display */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setError(''); // Clear error when switching tabs
                    }}
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                      activeTab === 'signin'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setError(''); // Clear error when switching tabs
                    }}
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                      activeTab === 'signup'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Google Sign-In (shown on both tabs, but hidden during email link mode) */}
                {showGoogleSignIn && !isEmailLinkLogin && (
                  <>
                    <button
                      type="button"
                      className="w-full mb-4 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={signInWithGoogle}
                      disabled={isLoading}
                    >
                      <Image
                        src="/assets/google_ctn.svg"
                        alt={activeTab === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
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
                )}

                {/* Sign In Tab Content */}
                {activeTab === 'signin' && (
                  <form
                    onSubmit={isEmailLinkLogin ? handleSubmit : handlePasswordLogin}
                    ref={formRef}
                    className="space-y-4"
                  >
                    {isEmailLinkLogin && (
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setError('');
                          }}
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>

                    {!isEmailLinkLogin && (
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                          }}
                          placeholder="Enter your password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                          required
                        />
                      </div>
                    )}

                    {!isEmailLinkLogin && (
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handlePasswordReset}
                          disabled={isLoading}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!email || (!isEmailLinkLogin && !password) || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Loading...</span>
                        </div>
                      ) : isEmailLinkLogin ? (
                        <div className="flex items-center justify-center gap-2">
                          <MailIcon size={20} />
                          <span>Send Sign-In Link</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <LockIcon size={20} />
                          <span>Sign In</span>
                        </div>
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmailLinkLogin(!isEmailLinkLogin);
                          setError(''); // Clear error when switching auth modes
                        }}
                        className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors duration-200"
                      >
                        {isEmailLinkLogin ? "Use Email/Password" : "Use Email Link"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Sign Up Tab Content */}
                {activeTab === 'signup' && (
                  <form
                    onSubmit={isEmailLinkLogin ? handleSubmit : handlePasswordSignup}
                    ref={formRef}
                    className="space-y-4"
                  >
                    {isEmailLinkLogin && (
                      <div>
                        <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          id="signup-name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setError('');
                          }}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>

                    {!isEmailLinkLogin && (
                      <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                          }}
                          placeholder="Create a password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Password should be at least 6 characters long
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          required
                        />
                        <span className="text-sm text-gray-700">
                          I accept the{" "}
                          <Link href="/terms-conditions" className="text-blue-600 hover:text-blue-800 underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!email || (!isEmailLinkLogin && !password) || !acceptTerms || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Loading...</span>
                        </div>
                      ) : isEmailLinkLogin ? (
                        <div className="flex items-center justify-center gap-2">
                          <MailIcon size={20} />
                          <span>Send Sign-Up Link</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <LockIcon size={20} />
                          <span>Create Account</span>
                        </div>
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmailLinkLogin(!isEmailLinkLogin);
                          setError(''); // Clear error when switching auth modes
                        }}
                        className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors duration-200"
                      >
                        {isEmailLinkLogin ? "Use Email/Password" : "Use Email Link"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function isFirebaseError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof (error as { code?: unknown }).code === "string"
  );
}
