"use client";

import { useEffect, useActionState } from "react";
import { useFormStatus } from 'react-dom';
import { useDialog } from '@/context/DialogContext';
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import {
  InputTipoDocumentoIdentidad,
  InputDocumentoIdentidad,
  InputTextoGeneral,
  InputFecha,
  InputGenero,
  InputTelefono,
  InputEmail,
  InputRol,
  InputPassword
} from '@/components/common/inputs';
import { addSingleUserAction } from "@/app/acciones/UsuariosActions";

// Component for the submit button with pending state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <BotonGeneral type="submit" disabled={pending}>
      {pending ? 'Creando...' : 'Crear usuario'}
    </BotonGeneral>
  );
}

// Initial state for useActionState
const initialState = {
  message: null,
  success: false,
};

function FormAgregarUsuarios({ onSuccess }) {
  const { showPopUp } = useDialog();

  // Use useActionState to manage the state of the action
  const [state, formAction] = useActionState(addSingleUserAction, initialState);

  // Effect to show pop-up based on the state and handle success callback
  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? 'success' : 'error');
      
      // If successful and onSuccess callback is provided, call it
      if (state.success && onSuccess) {
        onSuccess();
      }
    }
  }, [state, showPopUp, onSuccess]);

  return (
    <form action={formAction} className="space-y-5 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="tipoDocumento" className="block mb-1 text-sm font-medium text-accent1">
            Tipo de Documento
          </label>
          <div className="relative">
            <InputTipoDocumentoIdentidad />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="numeroDocumento" className="block mb-1 text-sm font-medium text-accent1">
            Número de Documento
          </label>
          <div className="relative">
            <InputDocumentoIdentidad required />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="primerNombre" className="block mb-1 text-sm font-medium text-accent1">
            Primer nombre
          </label>
          <div className="relative">
            <InputTextoGeneral id="primerNombre" name="primerNombre" required placeholder="Primer nombre" />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="segundoNombre" className="block mb-1 text-sm font-medium text-accent1">
            Segundo nombre
          </label>
          <div className="relative">
            <InputTextoGeneral id="segundoNombre" name="segundoNombre" placeholder="Segundo nombre (opcional)" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="primerApellido" className="block mb-1 text-sm font-medium text-accent1">
            Primer apellido
          </label>
          <div className="relative">
            <InputTextoGeneral id="primerApellido" name="primerApellido" required placeholder="Primer apellido" />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="segundoApellido" className="block mb-1 text-sm font-medium text-accent1">
            Segundo apellido
          </label>
          <div className="relative">
            <InputTextoGeneral id="segundoApellido" name="segundoApellido" required placeholder="Segundo apellido" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="fechaNacimiento" className="block mb-1 text-sm font-medium text-accent1">
            Fecha de nacimiento
          </label>
          <div className="relative">
            <InputFecha id="fechaNacimiento" name="fechaNacimiento" required />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="genero" className="block mb-1 text-sm font-medium text-accent1">
            Género
          </label>
          <div className="relative">
            <InputGenero id="genero" name="genero" required />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="telefono" className="block mb-1 text-sm font-medium text-accent1">
            Número de teléfono
          </label>
          <div className="relative">
            <InputTelefono id="numeroTelefono" name="numeroTelefono" required />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="rol" className="block mb-1 text-sm font-medium text-accent1">
            Rol
          </label>
          <div className="relative">
            <InputRol id="rol" name="rol" required />
          </div>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="direccion" className="block mb-1 text-sm font-medium text-accent1">
          Dirección
        </label>
        <div className="relative">
          <InputTextoGeneral id="direccion" name="direccion" required placeholder="Dirección" />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="correo-registro" className="block mb-1 text-sm font-medium text-accent1">
          Correo electrónico
        </label>
        <div className="relative">
          <InputEmail id="correo-registro" name="correo" required placeholder="Correo electrónico" />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="contrasena" className="block mb-1 text-sm font-medium text-accent1">
          Contraseña
        </label>
        <div className="relative">
          <InputPassword id="contrasena" name="contrasena" required placeholder="Contraseña" />
        </div>
      </div>

      <div className="flex flex-row gap-2 items-center justify-center mt-5">
        <SubmitButton />
      </div>
    </form>
  );
}

export default FormAgregarUsuarios;
