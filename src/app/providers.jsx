"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
<<<<<<< HEAD
import { DialogProvider } from '@/context/DialogContext';
=======
>>>>>>> db35ad5 (diseños login y registro)

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
      <DialogProvider>
        {children}
      </DialogProvider>
=======
      {children}
>>>>>>> db35ad5 (diseños login y registro)
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
