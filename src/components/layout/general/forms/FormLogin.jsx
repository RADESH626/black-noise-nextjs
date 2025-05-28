"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useActionState } from 'react'; // Import hooks
import { useFormStatus } from 'react-dom'; // Import useFormStatus
import { signIn } from "next-auth/react"; // Import signIn
import { usePopUp } from '@/context/PopUpContext';
import { InputEmail, InputPassword } from "@/components/common/inputs";
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { loginAction } from '@/app/acciones/UsuariosActions'; // Import Server Action

// Componente para el botón de envío con estado pendiente
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <BotonGeneral
      type="submit"
      disabled={pending} // Disable button while pending
    >
      {pending ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
    </BotonGeneral>
  );
}

// Estado inicial para useActionState
const initialState = {
  message: null,
  success: false,
  email: null,
  password: null,
  userRole: null,
  readyForSignIn: false,
};

function FormLogin() {
  const { showPopUp } = usePopUp();
  const router = useRouter();

  // Usar useActionState para manejar el estado de la acción
  const [state, formAction] = useActionState(loginAction, initialState);

  // Efecto para manejar la respuesta de la Server Action y llamar a signIn
  useEffect(() => {
    console.log('Frontend Login: State changed:', state);
    
    if (state.readyForSignIn && state.email && state.password) {
      console.log('Frontend Login: Datos recibidos de Server Action, intentando signIn.');
      console.log('Frontend Login: User role from state:', state.userRole);
      
      const handleSignIn = async () => {
        const result = await signIn('credentials', {
          email: state.email,
          password: state.password,
          redirect: false,
        });

        console.log('Frontend Login: Resultado de signIn:', result);

        if (result.error) {
          console.log('Frontend Login: Error en signIn:', result.error);
          showPopUp('Credenciales incorrectas', 'error');
        } else {
          console.log('Frontend Login: Inicio de sesión exitoso.');
          console.log('Frontend Login: Verificando rol para redirección:', state.userRole);
          showPopUp('¡Inicio de sesión exitoso!', 'success');
          
          // Redirección basada en el rol del usuario
          if (state.userRole === 'ADMINISTRADOR') {
            console.log('Frontend Login: Redirigiendo administrador al panel de admin.');
            router.push('/admin');
          } else if (state.userRole === 'PROVEEDOR') {
            console.log('Frontend Login: Redirigiendo proveedor al panel de proveedor.');
            router.push('/proveedor');
          } else {
            console.log('Frontend Login: Redirigiendo cliente al inicio. Rol actual:', state.userRole);
            router.push('/');
          }
        }
      };
      handleSignIn();
    } else if (state.message) {
       // Show messages from server-side validation if any
       showPopUp(state.message, state.success ? 'success' : 'error');
    }
  }, [state, showPopUp, router]); // Dependencias del useEffect

  return (
    // Usar la función formAction del useFormState en la prop action
    <form className="flex flex-col" action={formAction}>

      <div className="relative mb-5">
        <label className="block mb-1 text-sm font-medium text-accent1">Correo electrónico</label>
        <div className="relative">
          {/* InputEmail ahora es uncontrolled o usa name para FormData */}
          <InputEmail
            required
            placeholder="ejemplo@gmail.com"
            name="correo" // Name is crucial for FormData
          />
        </div>
      </div>

      <div className="relative mb-5">
        <label htmlFor="password-login" className="block mb-1 text-sm font-medium text-accent1">Contraseña</label>
        <div className="relative">
          {/* InputPassword ahora es uncontrolled o usa name para FormData */}
          <InputPassword
            required
            placeholder="contraseña"
            name="password" // Name is crucial for FormData
          />
        </div>
      </div>

      <div className="relative mb-5 items-center flex justify-center">
        {/* Usar el componente SubmitButton para mostrar el estado pendiente */}
        <SubmitButton />
      </div>

      <div className="text-center mt-5">
        <p className="mb-4">¿No tienes una cuenta?</p>
        <a href="/registro" id="showRegister">
          <BotonGeneral>
            Regístrate ahora
          </BotonGeneral>
        </a>
      </div>

    </form>
  );
}

export default FormLogin;
