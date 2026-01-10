"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui/Button";
import { useTheme } from "next-themes";

export function ThemeToggle(): React.ReactElement | null {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <IconButton
      icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
      aria-label="Toggle theme"
      variant="ghost"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="text-foreground hover:bg-accent"
    />
  );
}

export default ThemeToggle;

