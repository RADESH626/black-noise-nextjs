"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const MockSessionContext = createContext();

export const MockSessionProvider = ({ children }) => {
  const [mockSession, setMockSession] = useState(null);

  useEffect(() => {
    // Load mock session state from localStorage on component mount
    const storedMockSession = localStorage.getItem('mockSession');
    if (storedMockSession) {
      setMockSession(JSON.parse(storedMockSession));
    } else {
      // Default to a mock session if nothing in localStorage
      setMockSession({
        user: {
          name: "Mock User",
          email: "mock@example.com",
          image: "/img/perfil/FotoPerfil.webp", // Example mock image
          role: "CLIENTE", // Default role for mock session
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expires in 24 hours
      });
    }
  }, []);

  useEffect(() => {
    // Save mock session state to localStorage whenever it changes
    if (mockSession !== null) {
      localStorage.setItem('mockSession', JSON.stringify(mockSession));
    }
  }, [mockSession]);

  const toggleMockSession = () => {
    setMockSession((prevSession) => {
      if (prevSession) {
        // If there's a session, clear it (simulate logout)
        localStorage.removeItem('mockSession');
        return null;
      } else {
        // If no session, create a default mock session (simulate login)
        const newSession = {
          user: {
            name: "Mock User",
            email: "mock@example.com",
            image: "/img/perfil/FotoPerfil.webp",
            role: "CLIENTE",
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };
        localStorage.setItem('mockSession', JSON.stringify(newSession));
        return newSession;
      }
    });
  };

  return (
    <MockSessionContext.Provider value={{ mockSession, toggleMockSession }}>
      {children}
    </MockSessionContext.Provider>
  );
};

export const useMockSession = () => {
  const context = useContext(MockSessionContext);
  if (!context) {
    throw new Error('useMockSession must be used within a MockSessionProvider');
  }
  return context;
};
