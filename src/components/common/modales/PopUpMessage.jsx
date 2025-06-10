import React, { useEffect, useState } from 'react';
import styles from './PopUpMessage.module.css';

const PopUpMessage = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 2000); // Auto-hide after 2 seconds (adjusted to standard duration)

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const popupClass = type === 'success' ? styles.popupSuccess : styles.popupError;

  return (
   <div className="fixed top-0 left-0 right-0 flex justify-center z-50 animate-slideDown">
      <div className={`${popupClass} text-secondary px-6 py-4 rounded-b-lg popup-shadow min-w-[300px] max-w-[500px] mx-4 mt-0`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 bg-green-700 p-2 rounded">
            <span className={`text-2xl ${type === 'success' ? 'text-neutral-100' : 'text-neutral-100'}`}>
              {type === 'success' ? '✓' : '✕'}
            </span>
            <p className="font-medium text-lg text-neutral-100">{message}</p>
          </div>
          <button 
            onClick={() => { setIsVisible(false); onClose(); }} 
            className="ml-4 text-secondary hover:text-neutral-300 transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpMessage;
