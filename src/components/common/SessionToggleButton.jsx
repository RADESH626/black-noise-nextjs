"use client";
import { useMockSession } from '@/context/MockSessionContext';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

export default function SessionToggleButton() {
  const { simulatedSession, toggleMockSession } = useMockSession();

  console.log("SessionToggleButton re-rendered. simulatedSession:", simulatedSession ? "Authenticated" : "Unauthenticated");

  const buttonText = simulatedSession ? 'Simular Sesión: Logueado' : 'Simular Sesión: No Logueado';
  const buttonClass = simulatedSession ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700';

  return (
    <BotonGeneral
      onClick={toggleMockSession}
      className={`fixed bottom-5 right-5 z-1000 ${buttonClass} text-white`}
    >
      {buttonText}
    </BotonGeneral>
  );
}
