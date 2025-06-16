"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import PopUpMessage from '../components/common/modales/PopUpMessage';
import Modal from '../components/common/modales/Modal'; // Import the new Modal component

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('success'); // 'success' or 'error'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('default');

  const showPopUp = useCallback((msg, msgType = 'success') => {
    console.log('DialogContext: showPopUp called with message:', msg, 'and type:', msgType);
    setMessage(msg);
    setType(msgType);
  }, []);

  const hidePopUp = useCallback(() => {
    setMessage(null);
  }, []);

  const openModal = useCallback((title, content, type = 'default') => {
    setModalTitle(title);
    setModalContent(content);
    setModalType(type);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalTitle('');
    setModalType('default');
  }, []);

  return (
    <DialogContext.Provider value={{ showPopUp, openModal, closeModal }}>
      {children}
      {message && (
        <PopUpMessage
          message={message}
          type={type}
          onClose={hidePopUp}
        />
      )}
      {isModalOpen && (
        <Modal
          title={modalTitle}
          onClose={closeModal}
          isOpen={isModalOpen}
          type={modalType}
        >
          {modalContent}
        </Modal>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
