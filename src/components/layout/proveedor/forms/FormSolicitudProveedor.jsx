"use client";

import React, { useEffect, useActionState } from 'react'; // Import useEffect and useActionState
import { useSession } from 'next-auth/react';
import { useFormStatus } from 'react-dom'; // Import hooks
import { useDialog } from '@/context/DialogContext';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import InputGeneral from '@/components/common/inputs/InputGeneral';
import { CategoriaProducto } from '@/models/enums/CategoriaProducto';
import { MetodoPago } from '@/models/enums/pago/MetodoPago';
import { submitSupplierApplicationAction } from '@/app/acciones/SolicitudProveedorActions'; // Import Server Action

// Componente para el botón de envío con estado pendiente
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <BotonGeneral type="submit" disabled={pending}>
      {pending ? 'Enviando...' : 'Enviar Solicitud'}
    </BotonGeneral>
  );
}

// Estado inicial para useActionState
const initialState = {
  message: null,
  success: false,
};

function FormSolicitudProveedor() {
    const { data: session } = useSession(); // Keep useSession for client-side checks if needed
    const { showPopUp } = useDialog(); // Add useDialog hook

    // Usar useActionState para manejar el estado de la acción
    const [state, formAction] = useActionState(submitSupplierApplicationAction, initialState);

    // Efecto para mostrar pop-up y resetear formulario basado en el estado
    useEffect(() => {
        if (state.message) {
            showPopUp(state.message, state.success ? 'success' : 'error');
        }
        if (state.success) {
            // Reset the form after successful submission
            // This requires accessing the form element, which is a bit tricky with Server Actions
            // A common pattern is to use a key prop on the form or manage form state differently
            // For now, we'll just show success message. Resetting can be added later if needed.
            // Or, the Server Action could return data to trigger a client-side reset.
            // Let's add a simple reset by key for now.
        }
    }, [state, showPopUp]); // Dependencias del useEffect

    // Keep client-side session check for rendering the form
    // Temporarily disable client-side session check for development
    // if (!session) {
    //     // This part is handled in the parent page component (src/app/solicitud-proveedor/page.jsx)
    //     // but keeping this check here for clarity or if this component is used elsewhere.
    //     return <p>Por favor, inicia sesión para enviar una solicitud.</p>;
    // }


    return (
        <div className="max-w-2xl mx-auto p-8 bg-neutral-800 text-secondary rounded-xl shadow-2xl border border-accent1">

            <h2 className="text-4xl font-extrabold text-center mb-8 text-accent1">Solicitud para ser Proveedor</h2>

            {/* Usar la función formAction del useActionState en la prop action */}
            {/* Add a key prop to force form reset on success if needed */}
            <form action={formAction} className="space-y-6">
                <InputGeneral
                    label="Nombre de la Empresa"
                    name="nombreEmpresa" // Name is crucial for FormData
                    type="text"
                    required
                    className="mb-4"
                />
                <InputGeneral
                    label="NIT"
                    name="nit" // Name is crucial for FormData
                    type="text"
                    required
                    className="mb-4"
                />
                <InputGeneral
                    label="Dirección de la Empresa"
                    name="direccionEmpresa" // Name is crucial for FormData
                    type="text"
                    required
                    className="mb-4"
                />

                <div className="mb-4">
                    <label htmlFor="especialidad" className="block text-sm font-medium text-neutral-300 mb-2">
                        Especialidad
                    </label>
                    <select
                        id="especialidad"
                        name="especialidad" // Name is crucial for FormData
                        required
                        className="w-full p-3 bg-neutral-800 border border-neutral-600 rounded-md text-secondary focus:ring-accent1 focus:border-accent1"
                    >
                        <option value="">Selecciona una especialidad</option>
                        {Object.values(CategoriaProducto).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Métodos de Pago Aceptados
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.values(MetodoPago).map((method) => (
                            <div key={method} className="flex items-center bg-neutral-800 p-3 rounded-md border border-neutral-600">
                                <input
                                    type="checkbox"
                                    id={method}
                                    name="metodosPagoAceptados" // Name is crucial for FormData
                                    value={method}
                                    className="h-5 w-5 text-accent1 bg-neutral-700 border-neutral-500 rounded focus:ring-accent1 cursor-pointer"
                                />
                                <label htmlFor={method} className="ml-3 text-sm text-neutral-300 cursor-pointer">
                                    {method.replace(/_/g, ' ')}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <InputGeneral
                    label="Comisión Propuesta (%)"
                    name="comisionPropuesta" // Name is crucial for FormData
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="mb-4"
                />
                <InputGeneral
                    label="Mensaje Adicional (Opcional)"
                    name="mensajeAdicional" // Name is crucial for FormData
                    type="textarea"
                    className="mb-6"
                />

                {/* Error and Success messages will be handled by DialogContext */}
                {/* {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">¡Solicitud enviada con éxito! Te notificaremos pronto.</p>} */}

                {/* Usar el componente SubmitButton para mostrar el estado pendiente */}
                <SubmitButton />
            </form>
        </div>
    );
}

export default FormSolicitudProveedor;
