"use client";

import React, { useEffect, useRef, useState } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
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
${type === 'success' ? 'bg-green-700' : type === 'error' ? 'bg-red-700' : 'bg-gray-700'}
        text-secondary px-6 py-4 rounded-b-lg
        min-w-[300px] max-w-[500px] absolute top-4 left-1/2 -translate-x-1/2 z-50
        border-0 outline-0
      `}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 p-2 rounded">
          {type === 'success' && (
            <span className="text-2xl text-neutral-100">✓</span>
          )}
          {type === 'error' && (
            <span className="text-2xl text-neutral-100">✕</span>
          )}
          <span className="font-medium text-lg text-neutral-100">{message}</span>
        </div>
        {!persistent && (
          <BotonGeneral
            onClick={() => { setIsVisible(false); onClose(); }}
            variant="secondary"
            className="ml-4"
          >
            Cerrar
          </BotonGeneral>
        )}
      </div >
    </dialog>
  );
};

export default PopUpMessage;
