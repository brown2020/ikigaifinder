import { useState, useEffect } from "react";
interface ToastProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
}

const Toast = ({ type, message, onClose }:ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const toastStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 transition-all duration-300 
                  ${toastStyles[type]} 
                  ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <span>{message}</span>
      <button
        className="ml-4 text-lg font-semibold focus:outline-none"
        onClick={() => {
          setIsVisible(false);
          onClose();
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
