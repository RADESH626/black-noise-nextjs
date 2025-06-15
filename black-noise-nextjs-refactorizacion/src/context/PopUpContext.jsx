"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import PopUpMessage from '../components/common/modales/PopUpMessage';

const PopUpContext = createContext();

export const PopUpProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('success'); // 'success' or 'error'

  const showPopUp = useCallback((msg, msgType = 'success') => {
    console.log('PopUpContext: showPopUp called with message:', msg, 'and type:', msgType);
    setMessage(msg);
    setType(msgType);
  }, []);

  const hidePopUp = useCallback(() => {
    setMessage(null);
  }, []);

  return (
    <PopUpContext.Provider value={{ showPopUp }}>
      {children}
      {message && (
        <PopUpMessage
          message={message}
          type={type}
          onClose={hidePopUp}
        />
      )}
    </PopUpContext.Provider>
  );
};

export const usePopUp = () => {
  const context = useContext(PopUpContext);
  if (!context) {
    throw new Error('usePopUp must be used within a PopUpProvider');
  }
  return context;
};
