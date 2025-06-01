"use client";

import React, { createContext, useContext, useState } from 'react';
import Modal from '@/components/common/modales/Modal';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    content: null,
    size: 'default', // 'small', 'default', 'large', or 'full'
  });

  const openModal = (title, content, size = 'default') => {
    setModalConfig({
      isOpen: true,
      title,
      content,
      size,
    });
  };

  const closeModal = () => {
    setModalConfig({
      isOpen: false,
      title: '',
      content: null,
    });
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        size={modalConfig.size}
      >
        {modalConfig.content}
      </Modal>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
