import React, { useEffect, useState, useRef } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

const PopUpMessage = ({ message, type, onClose, persistent = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isVisible) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }

    if (!persistent && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 1500); // Auto-hide after 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, persistent]);

  const popupClass = type === 'success' ? 'popup-success' : 'popup-error';

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 flex justify-center z-50 bg-transparent h-screen w-screen"
      onClick={(e) => {
        // Close if clicking outside the actual popup content
        const dialogDimensions = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          if (!persistent) { // Only close on outside click if not persistent
            setIsVisible(false);
            onClose();
          }
        }
      }}
    >
      <div className={`${popupClass} text-secondary px-6 py-4 rounded-b-lg popup-shadow min-w-[300px] max-w-[500px] mx-4 mt-0 backdrop-blur-sm bg-opacity-95 animate-slideDown`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className={`text-2xl ${type === 'success' ? 'text-neutral-100' : 'text-neutral-100'}`}>
              {type === 'success' ? '✓' : '✕'}
            </span>
            <p className="font-medium text-lg">{message}</p>
          </div>
          <BotonGeneral
            onClick={() => { setIsVisible(false); onClose(); }}
            variant="secondary"
            className="ml-4"
          >
            Cerrar
          </BotonGeneral>
        </div>
      </div>
    </dialog>
  );
};

export default PopUpMessage;
