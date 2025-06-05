"use client";
import { useSession } from 'next-auth/react';
import { useMockSession } from '@/context/MockSessionContext';

export function useSimulatedSession() {
  const { simulatedSession } = useMockSession();

  // For debugging, always return the simulated session state
  // This bypasses the real NextAuth session to isolate the mock session issue
  return { 
    data: simulatedSession, 
    status: simulatedSession ? 'authenticated' : 'unauthenticated' 
  };
}
