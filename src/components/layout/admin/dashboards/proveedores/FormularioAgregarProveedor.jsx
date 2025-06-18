"use client";

import React, { useEffect, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useDialog } from "@/context/DialogContext";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import InputGeneral from "@/components/common/inputs/InputGeneral";
import { crearProveedor } from "@/app/acciones/ProveedorActions";
import { CategoriaProducto } from "@/models/enums/CategoriaProducto"; // Import CategoriaProducto
import { MetodoPago } from "@/models/enums/pago"; // Import MetodoPago

// Submit button component with pending state
function SubmitButton({ customText = "Agregar Proveedor" }) {
  const { pending } = useFormStatus();
  return (
    <BotonGeneral type="submit" disabled={pending}>
      {pending ? "Agregando..." : customText}
    </BotonGeneral>
  );
}

// Initial state for useActionState
const initialState = {
  message: null,
  success: false,
};

function FormularioAgregarProveedor({ onSuccess }) {
  const { showPopUp } = useDialog();
  const [state, formAction] = useActionState(crearProveedor, initialState);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
  const [displayedAccessKey, setDisplayedAccessKey] = useState(null); // New state for access key

  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? "success" : "error");
      if (state.success && state.accessKey) {
        setDisplayedAccessKey(state.accessKey); // Set the access key if available
        // Do NOT call onSuccess here. The modal should remain open to show the key.
      } else if (state.success && onSuccess) {
        // If no access key is expected, or it's already handled, close the modal
        onSuccess();
      }
    }
  }, [state, showPopUp, onSuccess]);

  const handleCloseModal = () => {
    if (onSuccess) {
      onSuccess(); // Close the modal
    }
    setDisplayedAccessKey(null); // Clear the displayed key
  };

  const handlePaymentMethodChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPaymentMethods((prev) =>
      checked ? [...prev, value] : prev.filter((method) => method !== value)
    );
  };

  return (
    <form action={formAction} className="space-y-5 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Nombre de la Empresa
          </label>
          <InputGeneral
            type="text"
            id="nombreEmpresa"
            name="nombreEmpresa"
            placeholder="Nombre de la empresa"
            required
          />
        </div>
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            NIT
          </label>
          <InputGeneral
            type="text"
            id="nit"
            name="nit"
            placeholder="Número de Identificación Tributaria"
            required
          />
        </div>
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Dirección de la Empresa
          </label>
          <InputGeneral
            type="text"
            id="direccionEmpresa"
            name="direccionEmpresa"
            placeholder="Dirección de la empresa"
            required
          />
        </div>
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Especialidad
          </label>
          <select
            id="especialidad"
            name="especialidad"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Seleccione una especialidad</option>
            {Object.values(CategoriaProducto).map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Comisión (%)
          </label>
          <InputGeneral
            type="number"
            id="comision"
            name="comision"
            placeholder="Porcentaje de comisión"
            step="0.01"
            required
          />
        </div>
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Nombre del Dueño
          </label>
          <InputGeneral
            type="text"
            id="nombreDueño"
            name="nombreDueño"
            placeholder="Nombre del dueño de la empresa"
            required
          />
        </div>
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Teléfono de Contacto (Empresa)
          </label>
          <InputGeneral
            type="text"
            id="telefonoContacto"
            name="telefonoContacto"
            placeholder="Número de teléfono de contacto de la empresa"
            required
          />
        </div>
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Email de Contacto (Empresa)
          </label>
          <InputGeneral
            type="email"
            id="emailContacto"
            name="emailContacto"
            placeholder="Correo electrónico de contacto de la empresa"
            required
          />
        </div>
        <div className="relative md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Métodos de Pago Aceptados
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.values(MetodoPago).map((metodo) => (
              <div key={metodo} className="flex items-center">
                <input
                  type="checkbox"
                  id={`metodo-${metodo}`}
                  name="metodosPagoAceptados"
                  value={metodo}
                  checked={selectedPaymentMethods.includes(metodo)}
                  onChange={handlePaymentMethodChange}
                  className="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                />
                <label
                  htmlFor={`metodo-${metodo}`}
                  className="ml-2 text-sm text-white"
                >
                  {metodo}
                </label>
              </div>
            ))}
          </div>
        </div>
        {displayedAccessKey && ( // Conditionally render the access key field
          <div className="relative md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-purple-400">
              Clave de Acceso del Proveedor
            </label>
            <InputGeneral
              type="text"
              id="accessKeyDisplay"
              name="accessKeyDisplay"
              value={displayedAccessKey}
              readOnly
              className="bg-gray-800 cursor-not-allowed" // Make it look read-only
            />
            <p className="mt-2 text-sm text-gray-400">
              Por favor, copia esta clave. No se mostrará de nuevo.
            </p>
          </div>
        )}
      </div>
      {displayedAccessKey ? (
        <BotonGeneral type="button" onClick={handleCloseModal} customText="Cerrar" />
      ) : (
        <SubmitButton />
      )}
    </form>
  );
}

export default FormularioAgregarProveedor;
