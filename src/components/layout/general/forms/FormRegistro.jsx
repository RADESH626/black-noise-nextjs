
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react'; // Import hooks
import { useFormStatus } from 'react-dom'; // Import useFormStatus
import { usePopUp } from '@/context/PopUpContext';
import {
  InputPassword,
  InputTipoDocumentoIdentidad,
  InputDocumentoIdentidad,
  InputTelefono,
  InputEmail,
  InputFecha,
  InputGenero,
  InputTextoGeneral
} from "@/components/common/inputs";


import { registerAction } from "@/app/acciones/UsuariosActions"; // Import Server Action
import BotonGeneral from "@/components/common/botones/BotonGeneral";

// Componente para el botón de envío con estado pendiente
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <BotonGeneral
      type="submit"
      disabled={pending} // Disable button while pending
    >
      {pending ? 'Registrando...' : 'Registrarse'}
    </BotonGeneral>
  );
}

// Estado inicial para useActionState
const initialState = {
  message: null,
  success: false,
};


function FormRegistro() {
  const router = useRouter();
  const { showPopUp } = usePopUp();

  // Usar useActionState para manejar el estado de la acción
  const [state, formAction] = useActionState(registerAction, initialState);

  // Efecto para mostrar pop-up y redirigir basado en el estado
  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? 'success' : 'error');
    }
    if (state.success) {
      // Redirigir al login después del registro exitoso
      setTimeout(() => {
        router.push('/login');
      }, 2000); // Retraso para que el usuario vea el pop-up de éxito
    }
  }, [state, showPopUp, router]); // Dependencias del useEffect


  return (

    // Usar la función formAction del useActionState en la prop action
    <form className="space-y-5" action={formAction}>


      {/* ==================================================================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <div className="relative">

          <label htmlFor="tipoDocumento" className="block mb-1 text-sm font-medium text-accent1">Tipo de Documento</label>
          <div className="relative">
            <InputTipoDocumentoIdentidad id="tipoDocumento" name="tipoDocumento" required />
          </div>

        </div>


        <div className="relative">

          <label htmlFor="numeroDocumento" className="block mb-1 text-sm font-medium text-accent1">Número de Documento</label>
          <div className="relative">
            
            <InputDocumentoIdentidad id="numeroDocumento" name="numeroDocumento" required />

          </div>

        </div>



      </div>

      {/* ==================================================================================================== */}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <div className="relative">

          <label htmlFor="primerNombre" className="block mb-1 text-sm font-medium text-accent1">Primer nombre</label>
          <div className="relative">

            <InputTextoGeneral id="primerNombre" name="primerNombre" required placeholder="Primer nombre" />
            <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-accent1 input-icon'></i>

          </div>

        </div>


        <div className="relative">


          <label htmlFor="segundoNombre" className="block mb-1 text-sm font-medium text-accent1">Segundo nombre</label>
          <div className="relative">

            <InputTextoGeneral id="segundoNombre" name="segundoNombre" placeholder="Segundo nombre (opcional)" />
            <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-accent1 input-icon'></i>

          </div>

        </div>


      </div>

      {/* ==================================================================================================== */}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="relative">

          <label htmlFor="primerApellido" className="block mb-1 text-sm font-medium text-accent1">Primer apellido</label>
          <div className="relative">

            <InputTextoGeneral id="primerApellido" name="primerApellido" required placeholder="Primer apellido" />
            <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-accent1 input-icon'></i>

          </div>

        </div>


        <div className="relative">

          <label htmlFor="segundoApellido" className="block mb-1 text-sm font-medium text-accent1">Segundo apellido</label>
          <div className="relative">

            <InputTextoGeneral id="segundoApellido" name="segundoApellido" required placeholder="Segundo apellido" />
            <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-accent1 input-icon'></i>

          </div>

        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="relative">

          <label htmlFor="fechaNacimiento" className="block mb-1 text-sm font-medium text-accent1">Fecha de nacimiento</label>
          <div className="relative">

            <InputFecha id="fechaNacimiento" name="fechaNacimiento" required />

          </div>

        </div>


        <div className="relative">

          <label htmlFor="genero" className="block mb-1 text-sm font-medium text-accent1">Género</label>
          <div className="relative">

            <InputGenero required name="genero" />
            <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-accent1 input-icon'></i>

          </div>

        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="relative">

        <label htmlFor="telefono" className="block mb-1 text-sm font-medium text-accent1">Número de teléfono</label>
        <div className="relative">

          <InputTelefono id="numeroTelefono" name="numeroTelefono" required />
          <i className='bx bxs-phone absolute right-3 top-1/2 transform -translate-y-1/2 text-accent1 input-icon'></i>

        </div>

      </div>

      <div className="relative">

        <label htmlFor="direccion" className="block mb-1 text-sm font-medium text-accent1">Dirección</label>
        <div className="relative">

          <InputTextoGeneral id="direccion" name="direccion" required placeholder="Dirección" />
          <i className='bx bxs-home absolute right-3 top-1/2 transform -translate-y-1/2 text-accent1 input-icon'></i>

        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="relative">

        <label htmlFor="correo-registro" className="block mb-1 text-sm font-medium text-accent1">Correo electrónico</label>
        <div className="relative">
          <InputEmail id="correo-registro" name="correo" required placeholder="Correo electrónico" />
          <i className='bx bxs-envelope absolute right-3 top-1/2 transform -translate-y-1/2 text-accent1 input-icon'></i>

        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="relative">

        <label htmlFor="password-registro" className="block mb-1 text-sm font-medium text-accent1">Contraseña</label>
        <div className="relative">

          <InputPassword id="password-registro" name="password" required />
          <i className='bx bxs-lock-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-accent1 input-icon'></i>

        </div>

        <small className="text-xs text-black mt-1">Mínimo 8 caracteres, Mayúscula, minúscula, número y símbolo.</small>

      </div>

      {/* ==================================================================================================== */}

      <div className="relative">

        <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-accent1">Confirmar Contraseña</label>
        <div className="relative">
          <InputPassword id="confirmPassword" name="confirmPassword" required />
          <i className='bx bxs-lock-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-accent1 input-icon'></i>
        </div>

      </div>

      <div className="flex items-center justify-center mt-5">

        {/* Usar el componente SubmitButton para mostrar el estado pendiente */}
        <SubmitButton />

      </div>

      <div className="text-center mt-5 text-white">
        <p className="mb-4">¿Ya tienes una cuenta?</p>
        <a href="/login" id="showLogin">
          <BotonGeneral>
            Iniciar Sesión
          </BotonGeneral>
        </a>
      </div>
    </form>
  )
}

export default FormRegistro
