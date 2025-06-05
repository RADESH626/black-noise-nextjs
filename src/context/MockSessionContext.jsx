"use client";
import { createContext, useContext, useState } from 'react';

const MockSessionContext = createContext(null);

const mockClientSession = {
  user: {
    id: "mockUserId123", // Add a mock ID for fetching designs
    name: "Usuario de Prueba",
    email: "test@example.com",
    image: "/img/perfil/FotoPerfil.webp",
    role: "cliente",
    primerNombre: "Usuario",
    primerApellido: "Prueba",
    likes: 123,
    bio: "Esta es una biografía de prueba para el usuario simulado.",
  },
  expires: "2030-01-01T00:00:00.000Z",
};

export function MockSessionProvider({ children }) {
  const [simulatedSession, setSimulatedSession] = useState(null); // Inicia sin sesión

  const toggleMockSession = () => {
    setSimulatedSession(prev => {
      const newState = prev ? null : mockClientSession;
      console.log("Simulated Session Toggled to:", newState ? "Authenticated" : "Unauthenticated");
      return newState;
    });
  };

  return (
    <MockSessionContext.Provider value={{ simulatedSession, toggleMockSession }}>
      {children}
    </MockSessionContext.Provider>
  );
}

export function useMockSession() {
  return useContext(MockSessionContext);
}
