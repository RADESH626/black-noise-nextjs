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
  readyForSignIn: false, // Keep this flag for clarity, though `state.success` will also indicate readiness
};

function FormLogin() {
  const { showPopUp } = usePopUp();
  const router = useRouter();

  // Usar useActionState para manejar el estado de la acción
  const [state, formAction] = useActionState(loginAction, initialState);

  // Efecto para manejar la respuesta de la Server Action y llamar a signIn
  useEffect(() => {
    console.log('Frontend Login: State changed:', state);
    
    // If the server action was successful and indicates readiness for client-side signIn
    if (state.success && state.data?.readyForSignIn && state.data?.email && state.data?.password) { // Access data from state.data
      console.log('Frontend Login: Datos recibidos de Server Action, intentando signIn.');
      console.log('Frontend Login: User role from state:', state.data.userRole); // Access userRole from state.data
      
      const handleSignIn = async () => {
        const result = await signIn('credentials', {
          email: state.data.email, // Access email from state.data
          password: state.data.password, // Access password from state.data
          redirect: false,
        });

        console.log('Frontend Login: Resultado de signIn:', result);

        if (result.error) {
          console.log('Frontend Login: Error en signIn:', result.error);
          showPopUp('Credenciales incorrectas', 'error');
        } else {
          console.log('Frontend Login: Inicio de sesión exitoso.');
          console.log('Frontend Login: Verificando rol para redirección:', state.data.userRole); // Access userRole from state.data
          showPopUp('¡Inicio de sesión exitoso!', 'success');
          
          // Redirección basada en el rol del usuario
          if (state.data.userRole === 'ADMINISTRADOR') { // Access userRole from state.data
            console.log('Frontend Login: Redirigiendo administrador al panel de admin.');
            router.push('/admin');
          } else if (state.data.userRole === 'PROVEEDOR') { // Access userRole from state.data
            console.log('Frontend Login: Redirigiendo proveedor a la lista de pedidos.');
            router.push('/proveedor/pedidos');
          } else {
            console.log('Frontend Login: Redirigiendo cliente al catálogo. Rol actual:', state.data.userRole); // Access userRole from state.data
            router.push('/catalogo');
          }
        }
      };
      handleSignIn();
    } else if (state.message && !state.success) { // Only show error messages from server if signIn was not attempted or failed
       showPopUp(state.message, 'error');
    } else if (state.message && state.success) { // Show success message from server if signIn was not needed (e.g., already authenticated)
      showPopUp(state.message, 'success');
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
        <BotonGeneral type="button" onClick={() => { console.log('Attempting to redirect to /registro'); router.push('/registro'); }}>
          Regístrate ahora
        </BotonGeneral>
      </div>

    </form>
  );
}

export default FormLogin;
