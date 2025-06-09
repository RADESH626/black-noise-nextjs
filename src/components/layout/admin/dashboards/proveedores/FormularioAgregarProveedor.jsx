"use client";

import React, { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { usePopUp } from "@/context/PopUpContext";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import InputGeneral from "@/components/common/inputs/InputGeneral";
import { crearProveedor } from "@/app/acciones/ProveedorActions";
import { CategoriaProducto } from "@/models/enums/CategoriaProducto"; // Import CategoriaProducto

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
  const { showPopUp } = usePopUp();
  const [state, formAction] = useActionState(crearProveedor, initialState);

  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? "success" : "error");
      if (state.success && onSuccess) {
        onSuccess();
      }
    }
  }, [state, showPopUp, onSuccess]);

  return (
    <form action={formAction} className="space-y-5 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Nombre del Proveedor
          </label>
          <InputGeneral
            type="text"
            id="nombreProveedor"
            name="nombreProveedor"
            placeholder="Nombre del proveedor"
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
            RUT
          </label>
          <InputGeneral
            type="text"
            id="rut"
            name="rut"
            placeholder="Registro Único Tributario"
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
            Persona de Contacto
          </label>
          <InputGeneral
            type="text"
            id="contacto"
            name="contacto"
            placeholder="Nombre de la persona de contacto"
            required
          />
        </div>
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Teléfono de Contacto
          </label>
          <InputGeneral
            type="text"
            id="telefono"
            name="telefono"
            placeholder="Número de teléfono de contacto"
            required
          />
        </div>
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Email de Contacto
          </label>
          <InputGeneral
            type="email"
            id="email"
            name="email"
            placeholder="Correo electrónico de contacto"
            required
          />
        </div>
        <div className="relative md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Dirección de Contacto
          </label>
          <InputGeneral
            type="text"
            id="direccion"
            name="direccion"
            placeholder="Dirección de contacto del proveedor"
            required
          />
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}

export default FormularioAgregarProveedor;
