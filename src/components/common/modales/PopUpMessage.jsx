"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './PopUpMessage.module.css';

const PopUpMessage = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const dialogRef = useRef(null); // Ref for the dialog element

  console.log('PopUpMessage: Component rendered with message:', message, 'type:', type, 'isVisible:', isVisible);

  useEffect(() => {
    console.log('PopUpMessage: useEffect triggered. Setting auto-hide timer and dialog state.');
    if (isVisible) {
      dialogRef.current?.showModal(); // Show the dialog
    } else {
      dialogRef.current?.close(); // Close the dialog
    }

    const timer = setTimeout(() => {
      console.log('PopUpMessage: Auto-hide timer expired. Setting isVisible to false and calling onClose.');
      setIsVisible(false);
      onClose();
    }, 2000); // Auto-hide after 2 seconds

    return () => {
      console.log('PopUpMessage: Clearing auto-hide timer.');
      clearTimeout(timer);
    };
  }, [isVisible, onClose]); // Depend on isVisible to trigger dialog open/close

  // No need for `if (!isVisible) return null;` here, as dialogRef.current?.close() handles hiding

  const popupClass = type === 'success' ? styles.popupSuccess : styles.popupError;

  return (
    <dialog ref={dialogRef} className={`${popupClass} text-secondary px-6 py-4 rounded-b-lg popup-shadow min-w-[300px] max-w-[500px] mx-4 mt-0`} style={{ margin: 'auto' }}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 bg-green-700 p-2 rounded">
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
      </div>
    </dialog>
  );
};

export default PopUpMessage;
