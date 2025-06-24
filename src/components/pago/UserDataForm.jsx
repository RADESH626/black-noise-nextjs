"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ObtenerUsuarioPorCorreo } from '@/app/acciones/UsuariosActions';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

export default function UserDataForm({ onUserDataChange }) {
  const { data: session, status } = useSession();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [useMyData, setUseMyData] = useState(false);
  const [isDelivery, setIsDelivery] = useState(true);
  // Removed: const deliveryCost = 5.00; // Example delivery cost

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        const fetchedUser = await ObtenerUsuarioPorCorreo(session.user.email);
        if (fetchedUser) {
          sessionStorage.setItem('cachedUserName', fetchedUser.Nombre || '');
          sessionStorage.setItem('cachedUserEmail', fetchedUser.correo || '');
          sessionStorage.setItem('cachedUserAddress', fetchedUser.direccion || '');
        }
      }
    };
    fetchUserData();
  }, [session, status]);

  useEffect(() => {
    onUserDataChange({
      nombre,
      correo,
      direccion: isDelivery ? direccion : 'Recogida en tienda',
      isDelivery,
      deliveryCost: 0 // Always 0 as per new requirement
    });
  }, [nombre, correo, direccion, isDelivery, onUserDataChange]);

  const handleUseMyDataToggle = (e) => {
    const checked = e.target.checked;
    setUseMyData(checked);
    if (checked) {
      setNombre(sessionStorage.getItem('cachedUserName') || '');
      setCorreo(sessionStorage.getItem('cachedUserEmail') || '');
      setDireccion(sessionStorage.getItem('cachedUserAddress') || '');
    } else {
      setNombre('');
      setCorreo('');
      setDireccion('');
    }
  };

  const handleAutoFillAddress = () => {
    if (sessionStorage.getItem('cachedUserAddress')) {
      setDireccion(sessionStorage.getItem('cachedUserAddress'));
    } else if (session?.user?.address) {
      setDireccion(session.user.address);
    }
  };

  return (
    <div className="p-6 rounded shadow-md max-w-md w-full mb-6" style={{ backgroundColor: "#E9E9E9FF" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#111010FF" }}>Datos del Usuario</h2>
      
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="useMyData"
          checked={useMyData}
          onChange={handleUseMyDataToggle}
          className="mr-2"
        />
        <label htmlFor="useMyData" style={{ color: "#000000FF" }}>Rellenar automáticamente con mis datos</label>
      </div>

      <label className="block mb-4">
        <span style={{ color: "#000000FF" }}>Nombre Completo:</span>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ borderColor: "#000000FF", color: "#000000FF" }}
          className="w-full border rounded px-3 py-2 mt-1"
          placeholder="Tu nombre completo"
        />
      </label>
      <label className="block mb-4">
        <span style={{ color: "#000000FF" }}>Correo Electrónico:</span>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          style={{ borderColor: "#000000FF", color: "#000000FF" }}
          className="w-full border rounded px-3 py-2 mt-1"
          placeholder="tu.correo@example.com"
        />
      </label>

      <div className="mb-4">
        <span style={{ color: "#000000FF" }} className="block mb-2">Método de Entrega:</span>
        <div className="flex gap-4">
          <label className="flex-1 flex items-center">
            <input
              type="radio"
              name="deliveryOption"
              value="delivery"
              checked={isDelivery === true}
              onChange={() => setIsDelivery(true)}
              className="mr-2"
            />
            <span style={{ color: "#000000FF" }}>Envío a Domicilio</span>
          </label>
          <label className="flex-1 flex items-center">
            <input
              type="radio"
              name="deliveryOption"
              value="pickup"
              checked={isDelivery === false}
              onChange={() => setIsDelivery(false)}
              className="mr-2"
            />
            <span style={{ color: "#000000FF" }}>Recoger en Tienda</span>
          </label>
        </div>
        {/* Removed: {isDelivery && (
          <p className="text-sm mt-2" style={{ color: "#FF0000FF" }}>
            * El envío a domicilio tiene un costo adicional de ${deliveryCost.toFixed(2)}
          </p>
        )} */}
        {!isDelivery && (
          <p className="text-sm mt-2" style={{ color: "#000000FF" }}>
            * Cuando el pedido esté listo, tendrás que ir a recogerlo a nuestro punto de entrega.
          </p>
        )}
      </div>

      {isDelivery && (
        <label className="block mb-4">
          <span style={{ color: "#000000FF" }}>Dirección de Envío:</span>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            style={{ borderColor: "#000000FF", color: "#000000FF" }}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Tu dirección completa"
          />
          <BotonGeneral
            type="button"
            onClick={handleAutoFillAddress}
            className="mt-2 w-full py-2 bg-black text-white"
          >
            Rellenar dirección
          </BotonGeneral>
        </label>
      )}
    </div>
  );
}