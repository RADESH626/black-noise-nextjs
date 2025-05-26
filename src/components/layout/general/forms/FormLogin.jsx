"use client"

import { useState } from 'react';
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

        try {
            // TODO: Implement your new authentication logic here
            // For example:
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password })
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/'); // Or wherever you want to redirect after login
                showPopUp('¡Inicio de sesión exitoso!', 'success');
            } else {
                showPopUp(data.message || "Error al iniciar sesión", 'error');
            }
        } catch (error) {
            console.error('Error during login:', error);
            showPopUp("Error al iniciar sesión", 'error');
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
