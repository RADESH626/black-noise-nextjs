
"use client";
import { useRouter } from 'next/navigation';
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


import { RegistrarUsuario } from "@/app/acciones/UsuariosActions";
import BotonGeneral from "@/components/common/botones/BotonGeneral";


function FormRegistro() {
  const router = useRouter();
  const { showPopUp } = usePopUp();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      showPopUp('Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      const result = await RegistrarUsuario(formData);

      if (result.success) {
        // Mostrar primer mensaje de éxito
        showPopUp('¡Registro exitoso!', 'success');
        
        // Esperar 2 segundos
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mostrar segundo mensaje sobre inicio de sesión
        showPopUp('Ya puedes iniciar sesión con tu cuenta', 'success');
        
        // Esperar otro segundo antes de redirigir
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Redirigir a la página de login
        router.push('/login');
      } else {
        showPopUp(result.error || 'Error en el registro. Inténtalo de nuevo.', 'error');
      }
    } catch (error) {
      showPopUp('Error en el registro. Inténtalo de nuevo.', 'error');
    }
  };

  return (

    <form className="space-y-5" onSubmit={handleSubmit}>


      {/* ==================================================================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <div className="relative">

          <label htmlFor="tipoDocumento" className="block mb-1 text-sm font-medium text-bn-accent">Tipo de Documento</label>
          <div className="relative">
            <InputTipoDocumentoIdentidad id="tipoDocumento" name="tipoDocumento" required />
          </div>

        </div>


        <div className="relative">

          <label htmlFor="numeroDocumento" className="block mb-1 text-sm font-medium text-bn-accent">Número de Documento</label>
          <div className="relative">
            
            <InputDocumentoIdentidad id="numeroDocumento" name="numeroDocumento" required />

          </div>

        </div>



      </div>

      {/* ==================================================================================================== */}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <div className="relative">

          <label htmlFor="primerNombre" className="block mb-1 text-sm font-medium text-bn-accent">Primer nombre</label>
          <div className="relative">

            <InputTextoGeneral id="primerNombre" name="primerNombre" required placeholder="Primer nombre" />
            <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>

          </div>

        </div>


        <div className="relative">


          <label htmlFor="segundoNombre" className="block mb-1 text-sm font-medium text-bn-accent">Segundo nombre</label>
          <div className="relative">

            <InputTextoGeneral id="segundoNombre" name="segundoNombre" placeholder="Segundo nombre (opcional)" />
            <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>

          </div>

        </div>


      </div>

      {/* ==================================================================================================== */}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="relative">

          <label htmlFor="primerApellido" className="block mb-1 text-sm font-medium text-bn-accent">Primer apellido</label>
          <div className="relative">

            <InputTextoGeneral id="primerApellido" name="primerApellido" required placeholder="Primer apellido" />
            <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>

          </div>

        </div>


        <div className="relative">

          <label htmlFor="segundoApellido" className="block mb-1 text-sm font-medium text-bn-accent">Segundo apellido</label>
          <div className="relative">

            <InputTextoGeneral id="segundoApellido" name="segundoApellido" required placeholder="Segundo apellido" />
            <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>

          </div>

        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="relative">

          <label htmlFor="fechaNacimiento" className="block mb-1 text-sm font-medium text-bn-accent">Fecha de nacimiento</label>
          <div className="relative">

            <InputFecha id="fechaNacimiento" name="fechaNacimiento" required />

          </div>

        </div>


        <div className="relative">

          <label htmlFor="genero" className="block mb-1 text-sm font-medium text-bn-accent">Género</label>
          <div className="relative">

            <InputGenero  />
            <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>

          </div>

        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="relative">

        <label htmlFor="telefono" className="block mb-1 text-sm font-medium text-bn-accent">Número de teléfono</label>
        <div className="relative">

          <InputTelefono id="numeroTelefono" name="numeroTelefono" required />
          <i className='bx bxs-phone absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>

        </div>

      </div>

      <div className="relative">

        <label htmlFor="direccion" className="block mb-1 text-sm font-medium text-bn-accent">Dirección</label>
        <div className="relative">

          <InputTextoGeneral id="direccion" name="direccion" required placeholder="Dirección" />
          <i className='bx bxs-home absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>

        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="relative">

        <label htmlFor="correo-registro" className="block mb-1 text-sm font-medium text-bn-accent">Correo electrónico</label>
        <div className="relative">
          <InputEmail id="correo-registro" name="correo" required placeholder="Correo electrónico" />
          <i className='bx bxs-envelope absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>

        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="relative">

        <label htmlFor="password-registro" className="block mb-1 text-sm font-medium text-bn-accent">Contraseña</label>
        <div className="relative">

          <InputPassword id="password-registro" name="password" />
          <i className='bx bxs-lock-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>

        </div>

        <small className="text-xs text-black mt-1">Mínimo 8 caracteres, Mayúscula, minúscula, número y símbolo.</small>

      </div>

      {/* ==================================================================================================== */}

      <div className="relative">

        <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-bn-accent">Confirmar Contraseña</label>
        <div className="relative">
          <InputPassword id="confirmPassword" name="confirmPassword" required />
          <i className='bx bxs-lock-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>
        </div>

      </div>

      <div className="flex items-center justify-center mt-5">

        <BotonGeneral>Registrarse</BotonGeneral>

      </div>

      <div className="text-center mt-5 text-white">
        <p>¿Ya tienes una cuenta? <a href="/login" id="showLogin" className="font-medium text-white no-underline hover:underline">Iniciar Sesión</a></p>
      </div>
    </form>
  )
}

export default FormRegistro
