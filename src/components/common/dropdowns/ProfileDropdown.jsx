"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React, { useRef, useEffect } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function ProfileDropdown({ isOpen, onClose }) {
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleViewProfile = () => {
    onClose(); // Close dropdown before navigating
    router.push("/perfil");
  };

  const handleLogout = async () => {
    onClose(); // Close dropdown before logging out
    await signOut({ callbackUrl: "/login" });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 bg-transparent rounded-md shadow-lg py-1 z-50"
    >
      <BotonGeneral
        onClick={handleViewProfile}
        variant="info"
        className="w-full text-left"
      >
        Ver Perfil
      </BotonGeneral>
      <BotonGeneral
        onClick={handleLogout}
        variant="secondary"
        className="w-full text-left"
      >
        Cerrar Sesión
      </BotonGeneral>
    </div>
  );
}

export default ProfileDropdown;
