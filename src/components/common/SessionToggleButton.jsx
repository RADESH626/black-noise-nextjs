"use client";

import React from 'react';
import { useSimulatedSession } from '@/hooks/useSimulatedSession'; // Assuming this hook exists

const SessionToggleButton = () => {
  const { mockSession, toggleMockSession } = useSimulatedSession();

  return (
    <button
      onClick={toggleMockSession}
      className="fixed bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg z-50 hover:bg-blue-600 transition-colors duration-200"
      title="Toggle Mock Session"
    >
      {mockSession ? 'Disable Mock Session' : 'Enable Mock Session'}
    </button>
  );
};

export default SessionToggleButton;
