"use client";

import React, { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { usePopUp } from "@/context/PopUpContext";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import InputGeneral from "@/components/common/inputs/InputGeneral";
import { crearProveedor } from "@/app/acciones/ProveedorActions";

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
            Teléfono
          </label>
          <InputGeneral
            type="text"
            id="telefono"
            name="telefono"
            placeholder="Número de teléfono"
            required
          />
        </div>
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Email
          </label>
          <InputGeneral
            type="email"
            id="email"
            name="email"
            placeholder="Correo electrónico"
            required
          />
        </div>
        <div className="relative md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-purple-400">
            Dirección
          </label>
          <InputGeneral
            type="text"
            id="direccion"
            name="direccion"
            placeholder="Dirección del proveedor"
            required
          />
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}

export default FormularioAgregarProveedor;
