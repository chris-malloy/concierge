"use client";

import * as React from "react";
import { type ThemeProviderProps, ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Ensure the provider only mounts on the client
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render children directly on the server/initial render to avoid layout shift
    // or render null/fallback if preferred, but this avoids content jumping
    return <>{children}</>; 
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
} 