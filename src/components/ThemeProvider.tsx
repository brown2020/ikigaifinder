"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = PropsWithChildren<{
  /**
   * Set to true to disable theme switching in React Native WebView
   * (since the host app might control appearance).
   */
  isDisabled?: boolean;
}>;

export function ThemeProvider({
  children,
  isDisabled = false,
}: ThemeProviderProps): React.ReactElement {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={isDisabled ? "light" : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;

