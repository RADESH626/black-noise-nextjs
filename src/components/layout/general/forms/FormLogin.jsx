"use client"

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePopUp } from '@/context/PopUpContext';
import { InputEmail, InputPassword } from "@/components/common/inputs";
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function FormLogin() {
    const { showPopUp } = usePopUp();
    const router = useRouter();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {

        event.preventDefault();

        console.log("Intentando iniciar sesión con:", { correo, password });

        const result = await signIn('credentials', {
            redirect: false, // Es buena práctica mantenerlo en false para controlar el flujo
            correo: correo,
            password: password,
        });

        console.log("Resultado de signIn:", result);

        if (result?.ok && !result?.error) {
            console.log("Inicio de sesión exitoso, redirigiendo...");
            
            // Obtener la sesión después del inicio de sesión exitoso
            const session = await getSession();
            
            // Redirigir según el rol del usuario
            const destination = session?.user?.rol === 'ADMINISTRADOR' ? '/admin' : '/';
            console.log("Rol del usuario:", session?.user?.rol);
            router.push(destination);
            router.refresh(); // Para asegurar que el estado de la sesión se actualice en el layout/navbar
            showPopUp('¡Inicio de sesión exitoso!', 'success');
        } else {
            console.log("Error en el inicio de sesión:", result?.error);
            showPopUp(result?.error || "Credenciales incorrectas", 'error');
        }
    };

    return (


        <form className="flex flex-col" onSubmit={handleSubmit} >

            <div className="relative mb-5">

                <label className="block mb-1 text-sm font-medium text-bn-accent">Correo electrónico</label>

                <div className="relative">

                    <InputEmail required
                        placeholder="ejemplo@gmail.com"
                        name="correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)} />

                </div>

            </div>

            <div className="relative mb-5">

                <label htmlFor="password-login" className="block mb-1 text-sm font-medium text-bn-accent">Contraseña</label>

                <div className="relative">

                    <InputPassword required
                        placeholder="contraseña"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />

                </div>

            </div>
            <div className="relative mb-5 items-center flex justify-center">

                <BotonGeneral 
                type="submit"
                >Iniciar Sesión</BotonGeneral>

            </div>


            <div className="text-center mt-5 ">
                <p>¿No tienes una cuenta?
                    <a href="/registro" id="showRegister" className="font-medium  no-underline hover:underline">Regístrate ahora</a>
                </p>
            </div>

        </form>

    )
}

export default FormLogin;
