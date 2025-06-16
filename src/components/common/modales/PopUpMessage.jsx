"use client";

import React, { useEffect, useRef, useState } from 'react';
// Removed: import styles from './PopUpMessage.module.css';

const PopUpMessage = ({ message, type, onClose, persistent = false }) => { // Add persistent prop
  const [isVisible, setIsVisible] = useState(true);
  const dialogRef = useRef(null); // Ref for the dialog element

  useEffect(() => {
    if (isVisible) {
      dialogRef.current?.showModal(); // Show the dialog
    } else {
      dialogRef.current?.close(); // Close the dialog
    }

    let timer;
    if (!persistent) { // Only set timer if not persistent
      timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 2000); // Auto-hide after 2 seconds
    }

    return () => {
      if (timer) { // Only clear if timer was set
        clearTimeout(timer);
      }
    };
  }, [isVisible, onClose, persistent]); // Add persistent to dependency array

  // No need for `if (!isVisible) return null;` here, as dialogRef.current?.close() handles hiding

  // Removed: const popupClass = type === 'success' ? styles.popupSuccess : styles.popupError;

  return (
    <dialog
      ref={dialogRef}
      className={`
        ${type === 'success' ? 'bg-green-700' : 'bg-red-700'}
        text-secondary px-6 py-4 rounded-b-lg
        min-w-[300px] max-w-[500px] absolute top-4 left-1/2 -translate-x-1/2 z-50
        border-0 outline-0
      `}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 p-2 rounded">
          <span className={`text-2xl ${type === 'success' ? 'text-neutral-100' : 'text-neutral-100'}`}>
            {type === 'success' ? '✓' : '✕'}
          </span>
          <span className="font-medium text-lg text-neutral-100">{message}</span>
        </div>
        <button 
          onClick={() => { setIsVisible(false); onClose(); }} 
          className="ml-4 text-secondary hover:text-neutral-300 transition-colors duration-200"
        >
          ✕
        </button>
      </div >
    </dialog>
  );
};

export default PopUpMessage;
