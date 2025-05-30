"use client"

import React, { useState } from 'react';
import { Especialidad } from '@/models/enums/proveedor';
import { crearSolicitudProveedor } from '@/app/acciones/SolicitudProveedorActions'; // Import the server action
import { useRouter } from 'next/navigation'; // To redirect after submission

const FormAgregarSolicitudProveedor = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombreProveedor: '',
    nit: '',
    direccionEmpresa: '',
    rut: '',
    especialidad: '',
    // solicitanteId will be added in the server action based on the logged-in user
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, type: '', message: '' });
    setIsLoading(true);

    // Assuming the server action handles getting the solicitanteId from the session
    const result = await crearSolicitudProveedor(formData);

    if (result.error) {
      setAlert({ show: true, type: 'error', message: `Error al crear solicitud: ${result.error}` });
      setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 2000);
    } else {
      setAlert({ show: true, type: 'success', message: 'Solicitud de Proveedor creada exitosamente.' });
      setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 2000);
      // Clear form or redirect on success
      setFormData({
        nombreProveedor: '',
        nit: '',
        direccionEmpresa: '',
        rut: '',
        especialidad: '',
      });
      // Optional: Redirect after a delay
      // setTimeout(() => {
      //   router.push('/some-success-page');
      // }, 2000);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alert component removed, consider alternative for displaying messages */}
      {alert.show && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${alert.type === 'error' ? 'bg-red-100 text-red-700' : alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`} role="alert">
              {alert.message}
              <button onClick={() => setAlert({ show: false })} className="ml-4 float-right font-bold">X</button>
          </div>
      )}
      <div>
        <label htmlFor="nombreProveedor" className="block text-sm font-medium text-gray-700">Nombre del Proveedor:</label>
        <input
          type="text"
          id="nombreProveedor"
          name="nombreProveedor"
          value={formData.nombreProveedor}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="nit" className="block text-sm font-medium text-gray-700">NIT:</label>
        <input
          type="text"
          id="nit"
          name="nit"
          value={formData.nit}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="direccionEmpresa" className="block text-sm font-medium text-gray-700">Dirección de la Empresa:</label>
        <input
          type="text"
          id="direccionEmpresa"
          name="direccionEmpresa"
          value={formData.direccionEmpresa}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="rut" className="block text-sm font-medium text-gray-700">RUT:</label>
        <input
          type="text"
          id="rut"
          name="rut"
          value={formData.rut}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">Especialidad:</label>
        <select
          id="especialidad"
          name="especialidad"
          value={formData.especialidad}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Seleccione una especialidad</option>
          {Object.values(Especialidad).map((especialidad) => (
            <option key={especialidad} value={especialidad}>
              {especialidad.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
        {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
      </button>
    </form>
  );
};

export default FormAgregarSolicitudProveedor;
