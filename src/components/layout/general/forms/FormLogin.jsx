"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
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
        console.log('Frontend Login: handleSubmit iniciado.');
        console.log('Frontend Login: Intentando iniciar sesión con correo:', correo);

        try {
            const result = await signIn('credentials', {
                email: correo,
                password: password,
                redirect: false
            });

            console.log('Frontend Login: Resultado de signIn:', result);

            if (result.error) {
                console.log('Frontend Login: Error en signIn:', result.error);
                showPopUp('Credenciales incorrectas', 'error');
                return;
            }

            console.log('Frontend Login: Inicio de sesión exitoso.');
            showPopUp('¡Inicio de sesión exitoso!', 'success');
            router.push('/'); // Redirigir al inicio después del login exitoso
        } catch (error) {
            console.error('Frontend Login: Error durante el inicio de sesión:', error);
            showPopUp('Error al iniciar sesión', 'error');
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


            <div className="text-center mt-5">
                <p className="mb-4">¿No tienes una cuenta?</p>
                <a href="/registro" id="showRegister">
                    <BotonGeneral>
                        Regístrate ahora
                    </BotonGeneral>
                </a>
            </div>

        </form>

    )
}

export default FormLogin;
