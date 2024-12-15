// 'use client';

import * as React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider, ThemeProviderProps } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextUIProvider>
      <ThemeProvider defaultTheme="system" attribute="class" {...themeProps}>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
