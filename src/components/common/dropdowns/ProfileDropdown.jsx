"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Dropdown from './Dropdown';

function ProfileDropdown({ isOpen, onClose }) {
  const router = useRouter();

  const handleViewProfile = () => {
    onClose(); // Close dropdown before navigating
    router.push("/perfil");
  };

  const handleLogout = async () => {
    onClose(); // Close dropdown before logging out
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Dropdown isOpen={isOpen} onClose={onClose}>
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
    </Dropdown>
  );
}

export default ProfileDropdown;
