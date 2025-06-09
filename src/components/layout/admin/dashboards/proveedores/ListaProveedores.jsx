"use client";

import { useState, useEffect, useCallback } from 'react';
import { obtenerProveedoresHabilitados, eliminarProveedor } from '@/app/acciones/ProveedorActions.js';
import Tabla from '@/components/common/tablas/Tabla';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import Image from 'next/image';
import Link from 'next/link';
import BotonEditar from '@/components/common/botones/BotonEditar';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { usePopUp } from '@/context/PopUpContext';
import { useActionState } from 'react'; // For React 19
import { useFormStatus } from 'react-dom'; // For React 19

// Component for the delete provider button, using Server Actions pattern
function DeleteProviderForm({ providerId, onProviderDeleted }) {
    const { showPopUp } = usePopUp();
    const [state, formAction] = useActionState(eliminarProveedor, { message: null, success: false });
    const { pending } = useFormStatus();

    useEffect(() => {
        if (state.message) {
            showPopUp(state.message, state.success ? "success" : "error");
            if (state.success && onProviderDeleted) {
                onProviderDeleted(); // Notify parent to refresh provider list
            }
        }
    }, [state, showPopUp, onProviderDeleted]);

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={providerId} />
            <button
                type="submit"
                disabled={pending}
                className="px-3 py-1.5 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 text-sm whitespace-nowrap bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
                {pending ? 'Eliminando...' : 'Eliminar'}
            </button>
        </form>
    );
}

export default function ListaProveedores({ initialProviders }) {
  const [providers, setProviders] = useState(initialProviders || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showPopUp } = usePopUp();

  const fetchAndSetProviders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await obtenerProveedoresHabilitados();
      if (result && result.proveedores && Array.isArray(result.proveedores)) {
        setProviders(result.proveedores);
      } else {
        setError(result?.error || "No se recibió un array de proveedores.");
        console.log("Error al cargar proveedores en ListaProveedores.jsx:", result?.error || "No se recibió un array de proveedores.");
      }
    } catch (err) {
      setError(err.message);
      console.log("Error fetching providers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialProviders || initialProviders.length === 0) {
      fetchAndSetProviders();
    } else {
      setProviders(initialProviders);
    }
  }, [initialProviders, fetchAndSetProviders]);

  if (loading && providers.length === 0) {
    return <p>Cargando proveedores...</p>;
  }

  if (error) {
    return <p>Error al cargar proveedores: {error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      {providers.length > 0 ? (
        <Tabla>
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Empresa</th>
              <th className="py-3 px-6 text-left">Dueño</th>
              <th className="py-3 px-6 text-left">Contacto</th>
              <th className="py-3 px-6 text-left">Dirección</th>
              <th className="py-3 px-6 text-left">Métodos de Pago</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className='bg-gray-300 divide-y divide-gray-400'>
            {loading ? (
                <tr><TdGeneral colSpan="6" className="text-center py-4">Actualizando...</TdGeneral></tr>
            ) : providers.length === 0 ? (
                <tr><TdGeneral colSpan="6" className="text-center py-4">No se encontraron proveedores.</TdGeneral></tr>
            ) : (
                providers.map((provider) => (
                    <tr key={provider._id} className="hover:bg-gray-200">
                        <TdGeneral>
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="font-bold">{provider.nombreEmpresa}</p>
                                    <p className="text-sm text-gray-600">NIT: {provider.nit}</p>
                                </div>
                            </div>
                        </TdGeneral>
                        <TdGeneral>
                            {provider.nombreDueño}
                        </TdGeneral>
                        <TdGeneral>
                            <div className="text-sm">
                                <p><strong>Correo:</strong> {provider.emailContacto}</p>
                                <p><strong>Teléfono:</strong> {provider.telefonoContacto}</p>
                            </div>
                        </TdGeneral>
                        <TdGeneral>
                            {provider.direccionEmpresa}
                        </TdGeneral>
                        <TdGeneral>
                            {provider.metodosDePago && provider.metodosDePago.length > 0 ? (
                                <ul className="list-disc list-inside text-sm">
                                    {provider.metodosDePago.map((method, index) => (
                                        <li key={index}>{method}</li>
                                    ))}
                                </ul>
                            ) : 'N/A'}
                        </TdGeneral>
                        <TdGeneral>
                            <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
                                <BotonEditar onClick={() => {
                                    // TODO: Implement edit modal for provider
                                    showPopUp('Funcionalidad de edición de proveedor pendiente.', 'info');
                                }}>
                                    Editar
                                </BotonEditar>
                                <DeleteProviderForm 
                                    providerId={provider._id} 
                                    onProviderDeleted={fetchAndSetProviders} 
                                />
                            </div>
                        </TdGeneral>
                    </tr>
                ))
            )}
          </tbody>
        </Tabla>
      ) : (
        <p>No hay proveedores para mostrar.</p>
      )}
    </div>
  );
}
