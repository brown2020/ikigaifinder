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
  if (isDisabled) return <>{children}</>;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;

