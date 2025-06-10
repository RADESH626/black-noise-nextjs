import React, { useEffect, useState } from 'react';
import styles from './PopUpMessage.module.css';

const PopUpMessage = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  console.log('PopUpMessage: Component rendered with message:', message, 'type:', type, 'isVisible:', isVisible);

  useEffect(() => {
    console.log('PopUpMessage: useEffect triggered. Setting auto-hide timer.');
    const timer = setTimeout(() => {
      console.log('PopUpMessage: Auto-hide timer expired. Setting isVisible to false and calling onClose.');
      setIsVisible(false);
      onClose();
    }, 5000); // Auto-hide after 5 seconds (increased for debugging visibility)

    return () => {
      console.log('PopUpMessage: Clearing auto-hide timer.');
      clearTimeout(timer);
    };
  }, [onClose]);

  if (!isVisible) {
    console.log('PopUpMessage: isVisible is false, returning null.');
    return null;
  }

  const popupClass = type === 'success' ? styles.popupSuccess : styles.popupError;

  return (
   <div className="fixed top-0 left-0 right-0 flex justify-center z-50 animate-slideDown">
      <div className={`${popupClass} text-secondary px-6 py-4 rounded-b-lg popup-shadow min-w-[300px] max-w-[500px] mx-4 mt-0`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className={`text-2xl ${type === 'success' ? 'text-neutral-100' : 'text-neutral-100'}`}>
              {type === 'success' ? '✓' : '✕'}
            </span>
            <p className="font-medium text-lg">{message}</p>
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
