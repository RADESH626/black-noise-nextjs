"use client";

import { useState, useEffect, useCallback } from 'react';
import { obtenerProveedoresHabilitados, eliminarProveedor } from '@/app/acciones/ProveedorActions.js';
import Tabla from '@/components/common/tablas/Tabla';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import Image from 'next/image';
import Link from 'next/link';
import BotonEditar from '@/components/common/botones/BotonEditar';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { useDialog } from '@/context/DialogContext';
import { useActionState } from 'react'; // For React 19
import { useFormStatus } from 'react-dom'; // For React 19
import { MetodoPago } from '@/models/enums/pago/MetodoPago';
import BotonGeneral from '@/components/common/botones/BotonGeneral'; // Import BotonGeneral
import Loader from '@/components/Loader';

const PAYMENT_METHODS = Object.values(MetodoPago);
const PAYMENT_METHOD_DISPLAY_NAMES = {
    EFECTIVO: 'Efectivo',
    TRANSFERENCIA_BANCARIA: 'Transferencia Bancaria',
    TARJETA_CREDITO: 'Tarjeta Crédito',
    TARJETA_DEBITO: 'Tarjeta Débito',
    NEQUI: 'Nequi',
    DAVIPLATA: 'Daviplata',
    PSE: 'PSE',
};

// Component for the delete provider button, using Server Actions pattern
function DeleteProviderForm({ providerId, onProviderDeleted }) {
    const { showPopUp } = useDialog();
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
            <BotonGeneral
                type="submit"
                disabled={pending}
                variant="danger"
                className="px-3 py-1.5 text-sm whitespace-nowrap"
            >
                {pending ? 'Eliminando...' : 'Eliminar'}
            </BotonGeneral>
        </form>
    );
}

export default function ListaProveedores({ initialProviders }) {
  const [allProviders, setAllProviders] = useState(initialProviders || []);
  const [filteredProviders, setFilteredProviders] = useState(initialProviders || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ALL'); // 'ALL' for no filter
  const { showPopUp } = useDialog();

  const fetchAndSetProviders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await obtenerProveedoresHabilitados();
      if (result && result.proveedores && Array.isArray(result.proveedores)) {
        setAllProviders(result.proveedores);
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
      setAllProviders(initialProviders);
    }
  }, [initialProviders, fetchAndSetProviders]);

  useEffect(() => {
    if (selectedPaymentMethod === 'ALL') {
      setFilteredProviders(allProviders);
    } else {
      const filtered = allProviders.filter(provider =>
        provider.metodosPagoAceptados && provider.metodosPagoAceptados.includes(selectedPaymentMethod)
      );
      setFilteredProviders(filtered);
    }
  }, [allProviders, selectedPaymentMethod]);

  const handleFilterChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  if (loading && allProviders.length === 0) {
    return <Loader />;
  }

  if (error) {
    return <p>Error al cargar proveedores: {error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <label htmlFor="paymentMethodFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por Método de Pago:
        </label>
        <select
          id="paymentMethodFilter"
          name="paymentMethodFilter"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedPaymentMethod}
          onChange={handleFilterChange}
        >
          <option value="ALL">Todos los Métodos</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {PAYMENT_METHOD_DISPLAY_NAMES[method]}
            </option>
          ))}
        </select>
      </div>
      {filteredProviders.length > 0 || loading ? (
        <Tabla>
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Empresa</th>
              <th className="py-3 px-6 text-left">Dueño</th>
              <th className="py-3 px-6 text-left">Contacto</th>
              <th className="py-3 px-6 text-left">Dirección</th>
              {PAYMENT_METHODS.map((method) => (
                <th key={method} className="py-3 px-6 text-center whitespace-nowrap">{PAYMENT_METHOD_DISPLAY_NAMES[method]}</th>
              ))}
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className='bg-gray-300 divide-y divide-gray-400'>
            {loading ? (
                <tr><TdGeneral colSpan={6 + PAYMENT_METHODS.length} className="text-center py-4">Actualizando...</TdGeneral></tr>
            ) : filteredProviders.length === 0 ? (
                <tr><TdGeneral colSpan={6 + PAYMENT_METHODS.length} className="text-center py-4">No se encontraron proveedores con el filtro seleccionado.</TdGeneral></tr>
            ) : (
                filteredProviders.map((provider) => (
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
                        {PAYMENT_METHODS.map((method) => (
                            <TdGeneral key={method} className="text-center">
                                {provider.metodosPagoAceptados && provider.metodosPagoAceptados.includes(method) ? 'X' : '-'}
                            </TdGeneral>
                        ))}
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
