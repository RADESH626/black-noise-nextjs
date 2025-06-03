"use client";

import { useEffect, useActionState } from "react"; // Import useEffect and useActionState
import { useFormStatus } from "react-dom"; // Import useFormStatus
import { usePopUp } from '@/context/PopUpContext'; // Import PopUpContext
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import {
  InputTipoDocumentoIdentidad,
  InputDocumentoIdentidad,
  InputTextoGeneral,
  InputFecha,
  InputGenero,
  InputTelefono,
  InputEmail,
  InputRol
} from '@/components/common/inputs';

import { updateUserAction } from "@/app/acciones/UsuariosActions"; // Import Server Action

// Component for the submit button with pending state
function SubmitButton({ isProfile }) {
  const { pending } = useFormStatus();

  return (
    <BotonGeneral type="submit" disabled={pending}>
      {pending ? (isProfile ? 'Guardando...' : 'Editando...') : (isProfile ? 'Guardar cambios' : 'Editar usuario')}
    </BotonGeneral>
  );
}

// Initial state for useActionState
const initialState = {
  message: null,
  success: false,
};

// Receive initial user data as a prop
function FormEditarUsuario({ initialUserData, userId, isProfile }) {
  const { showPopUp } = usePopUp(); // Use PopUpContext

  // Bind the userId to the server action
  const updateUserActionWithId = updateUserAction.bind(null, userId);

  // Use useActionState to manage the state of the action
  const [state, formAction] = useActionState(updateUserActionWithId, initialState);

  // Effect to show pop-up based on the state
  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? 'success' : 'error');
    }
    // Optionally, handle redirection or other UI updates on success
    // if (state.success && !isProfile) {
    //   // Redirect to admin user list after editing a user in admin section
    //   // router.push('/admin/usuarios');
    // }
  }, [state, showPopUp, isProfile]); // Add isProfile to dependencies

  // No loading state needed here as initial data is passed as prop
  if (!initialUserData) {
     return (
      <div className="text-red-500 text-center p-4">
        Error cargando datos del usuario
      </div>
    );
  }


  return (
    // Use the formAction from useActionState in the action prop
    <form action={formAction} className="space-y-5 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="tipoDocumento" className="block mb-1 text-sm font-medium text-purple-400">
            Tipo de Documento
          </label>
          <div className="relative">
            {/* Use defaultValue for uncontrolled inputs */}
            <InputTipoDocumentoIdentidad name="tipoDocumento" defaultValue={initialUserData.tipoDocumento || ""} />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="numeroDocumento" className="block mb-1 text-sm font-medium text-purple-400">
            Número de Documento
          </label>
          <div className="relative">
            {/* Use defaultValue for uncontrolled inputs */}
            <InputDocumentoIdentidad required name="numeroDocumento" defaultValue={initialUserData.numeroDocumento || ""} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="primerNombre" className="block mb-1 text-sm font-medium text-purple-400">
            Primer nombre
          </label>
          <div className="relative">
            {/* Use defaultValue for uncontrolled inputs */}
            <InputTextoGeneral id="primerNombre" name="primerNombre" required placeholder="Primer nombre" defaultValue={initialUserData.primerNombre || ""} />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="segundoNombre" className="block mb-1 text-sm font-medium text-purple-400">
            Segundo nombre
          </label>
          <div className="relative">
            {/* Use defaultValue for uncontrolled inputs */}
            <InputTextoGeneral id="segundoNombre" name="segundoNombre" placeholder="Segundo nombre (opcional)" defaultValue={initialUserData.segundoNombre || ""} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="primerApellido" className="block mb-1 text-sm font-medium text-purple-400">
            Primer apellido
          </label>
          <div className="relative">
            {/* Use defaultValue for uncontrolled inputs */}
            <InputTextoGeneral id="primerApellido" name="primerApellido" required placeholder="Primer apellido" defaultValue={initialUserData.primerApellido || ""} />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="segundoApellido" className="block mb-1 text-sm font-medium text-purple-400">
            Segundo apellido
          </label>
          <div className="relative">
            {/* Use defaultValue for uncontrolled inputs */}
            <InputTextoGeneral id="segundoApellido" name="segundoApellido" required placeholder="Segundo apellido" defaultValue={initialUserData.segundoApellido || ""} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="fechaNacimiento" className="block mb-1 text-sm font-medium text-purple-400">
            Fecha de nacimiento
          </label>
          <div className="relative">
            {/* Use defaultValue for uncontrolled inputs */}
            <InputFecha
              id="fechaNacimiento"
              name="fechaNacimiento"
              required
              defaultValue={
                initialUserData.fechaNacimiento
                  ? new Date(initialUserData.fechaNacimiento).toISOString().split('T')[0]
                  : ""
              }
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="genero" className="block mb-1 text-sm font-medium text-purple-400">
            Género
          </label>
          <div className="relative">
            {/* Use defaultValue for uncontrolled inputs */}
            <InputGenero id="genero" name="genero" required defaultValue={initialUserData.genero || ""} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="telefono" className="block mb-1 text-sm font-medium text-purple-400">
            Número de teléfono
          </label>
          <div className="relative">
            {/* Use defaultValue for uncontrolled inputs */}
            <InputTelefono id="telefono" name="telefono" required defaultValue={initialUserData.numeroTelefono || ""} />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="rol" className="block mb-1 text-sm font-medium text-purple-400">
            Rol
          </label>
          <div className="relative">
            {/* Only allow changing rol if not in profile view */}
            <InputRol id="rol" name="rol" required defaultValue={initialUserData.rol || ""} disabled={isProfile} />
          </div>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="direccion" className="block mb-1 text-sm font-medium text-purple-400">
          Dirección
        </label>
        <div className="relative">
          {/* Use defaultValue for uncontrolled inputs */}
          <InputTextoGeneral id="direccion" name="direccion" required placeholder="Dirección" defaultValue={initialUserData.direccion || ""} />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="correo-registro" className="block mb-1 text-sm font-medium text-purple-400">
          Correo electrónico
        </label>
        <div className="relative">
          {/* Use defaultValue for uncontrolled inputs */}
          <InputEmail id="correo-registro" name="correo" required placeholder="Correo electrónico" defaultValue={initialUserData.correo || ""} />
        </div>
      </div>

      <div className="flex flex-row gap-2 items-center justify-center mt-5">
        {/* Use the SubmitButton component */}
        <SubmitButton isProfile={isProfile} />
      </div>
    </form>
  );
}

export default FormEditarUsuario;
