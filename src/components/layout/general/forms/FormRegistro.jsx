
"use client";
import { useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

        const handleSubmit = async (event) => {
            event.preventDefault();
            if (isSubmitting) return;
            
            setIsSubmitting(true);
            try {
                // Recolectar manualmente los datos del formulario
                const data = {
                    tipoDocumento: event.target.querySelector('[name="tipoDocumento"]').value,
                    numeroDocumento: event.target.querySelector('[name="numeroDocumento"]').value,
                    primerNombre: event.target.querySelector('[name="primerNombre"]').value,
                    segundoNombre: event.target.querySelector('[name="segundoNombre"]').value,
                    primerApellido: event.target.querySelector('[name="primerApellido"]').value,
                    segundoApellido: event.target.querySelector('[name="segundoApellido"]').value,
                    fechaNacimiento: event.target.querySelector('[name="fechaNacimiento"]').value,
                    genero: event.target.querySelector('[name="genero"]').value,
                    numeroTelefono: event.target.querySelector('[name="numeroTelefono"]').value,
                    direccion: event.target.querySelector('[name="direccion"]').value,
                    correo: event.target.querySelector('[name="correo"]').value,
                    password: event.target.querySelector('[name="password"]').value
                };

                const confirmPassword = event.target.querySelector('[name="confirmPassword"]').value;

                // Validaciones
                if (!data.password || data.password !== confirmPassword) {
                    showPopUp('Las contraseñas no coinciden', 'error');
                    return;
                }

                // Validar campos requeridos
                for (const [key, value] of Object.entries(data)) {
                    if (!value && key !== 'segundoNombre') {  // segundoNombre es opcional
                        showPopUp(`El campo ${key} es requerido`, 'error');
                        return;
                    }
                }

                console.log('Enviando datos:', data);

                const response = await fetch('/api/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

            console.log('Respuesta del servidor:', response.status);
            const result = await response.json();
            console.log('Datos de respuesta:', result);

            if (response.ok) {
                console.log('Registro exitoso:', result);
                showPopUp('¡Registro exitoso!', 'success');
                
                setTimeout(() => {
                    showPopUp('Ya puedes iniciar sesión con tu cuenta', 'success');
                    
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                }, 2000);
            } else {
                showPopUp(result.error || 'Error en el registro. Inténtalo de nuevo.', 'error');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            showPopUp('Error en el registro. Inténtalo de nuevo.', 'error');
        } finally {
            setIsSubmitting(false);
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

            <InputGenero required name="genero" />
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

          <InputPassword id="password-registro" name="password" required />
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

        <BotonGeneral 
            type="submit"
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </BotonGeneral>

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
