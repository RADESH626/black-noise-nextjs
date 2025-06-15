"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React, { useRef, useEffect } from 'react';

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
      className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50"
    >
      <button
        onClick={handleViewProfile}
        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
      >
        Ver Perfil
      </button>
      <button
        onClick={handleLogout}
        className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default ProfileDropdown;
