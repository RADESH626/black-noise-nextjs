"use client";

import { useState } from 'react';
import { HabilitarUsuario } from "@/app/acciones/UsuariosActions";

function FormHabilitarUsuario({ UserId }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const result = await HabilitarUsuario(formData);

        if (result?.error) {
            setMessage({ type: 'error', text: result.error });
        } else if (result?.success) {
            setMessage({ type: 'success', text: result.message });
        } else {
            setMessage({ type: 'error', text: 'Ocurrió un error inesperado.' });
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={UserId} />
            <button 
                type="submit" 
                className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:opacity-50"
                disabled={isSubmitting}
            > 
                {isSubmitting ? 'Habilitando...' : 'Habilitar'}
            </button>
            {message && (
                <p className={`mt-2 text-xs ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {message.text}
                </p>
            )}
        </form>
    );
}

export default FormHabilitarUsuario;
