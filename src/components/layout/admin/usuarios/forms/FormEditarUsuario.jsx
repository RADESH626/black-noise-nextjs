"use client";
import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { usePopUp } from '@/context/PopUpContext';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import InputTipoDocumentoIdentidad from '@/components/common/inputs/InputTipoDocumentoIdentidad';
import InputDocumentoIdentidad from '@/components/common/inputs/InputDocumentoIdentidad';
import InputTextoGeneral from '@/components/common/inputs/InputTextoGeneral';
import InputFecha from '@/components/common/inputs/InputFecha';
import InputGenero from '@/components/common/inputs/InputGenero';
import InputTelefono from '@/components/common/inputs/InputTelefono';
import InputEmail from '@/components/common/inputs/InputEmail';
import InputRol from '@/components/common/inputs/InputRol';
import { EditarUsuario } from '@/app/acciones/UsuariosActions'; // Import the Server Action

// Submit button component with pending state
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <BotonGeneral type="submit" disabled={pending}>
            {pending ? "Actualizando..." : "Actualizar Usuario"}
        </BotonGeneral>
    );
}

// Initial state for useActionState
const initialState = {
    message: null,
    success: false,
};

function FormEditarUsuario({ initialData, onSuccess }) {
    const { showPopUp } = usePopUp();
    const [state, formAction] = useActionState(EditarUsuario.bind(null, initialData._id), initialState);

    useEffect(() => {
        if (state.message) {
            showPopUp(state.message, state.success ? "success" : "error");
            if (state.success && onSuccess) {
                onSuccess();
            }
        }
    }, [state, showPopUp, onSuccess]);

    return (
        <form action={formAction} className="space-y-5 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <InputTipoDocumentoIdentidad 
                        name="tipoDocumento" 
                        defaultValue={initialData.tipoDocumento} 
                        required 
                    />
                </div>
                <div className="relative">
                    <InputDocumentoIdentidad 
                        name="numeroDocumento" 
                        defaultValue={initialData.numeroDocumento} 
                        required 
                    />
                </div>
                <div className="relative">
                    <InputTextoGeneral 
                        name="primerNombre" 
                        placeholder="Primer Nombre" 
                        defaultValue={initialData.primerNombre} 
                        required 
                    />
                </div>
                <div className="relative">
                    <InputTextoGeneral 
                        name="segundoNombre" 
                        placeholder="Segundo Nombre (Opcional)" 
                        defaultValue={initialData.segundoNombre} 
                    />
                </div>
                <div className="relative">
                    <InputTextoGeneral 
                        name="primerApellido" 
                        placeholder="Primer Apellido" 
                        defaultValue={initialData.primerApellido} 
                        required 
                    />
                </div>
                <div className="relative">
                    <InputTextoGeneral 
                        name="segundoApellido" 
                        placeholder="Segundo Apellido" 
                        defaultValue={initialData.segundoApellido} 
                        required 
                    />
                </div>
                <div className="relative">
                    <InputFecha 
                        name="fechaNacimiento" 
                        defaultValue={initialData.fechaNacimiento} 
                        required 
                    />
                </div>
                <div className="relative">
                    <InputGenero 
                        name="genero" 
                        defaultValue={initialData.genero} 
                        required 
                    />
                </div>
                <div className="relative">
                    <InputTelefono 
                        name="numeroTelefono" 
                        defaultValue={initialData.numeroTelefono} 
                        required 
                    />
                </div>
                <div className="relative">
                    <InputTextoGeneral 
                        name="direccion" 
                        placeholder="Dirección" 
                        defaultValue={initialData.direccion} 
                        required 
                    />
                </div>
                <div className="relative">
                    <InputEmail 
                        name="correo" 
                        placeholder="Correo Electrónico" 
                        defaultValue={initialData.correo} 
                        required 
                    />
                </div>
                <div className="relative">
                    <InputRol 
                        name="rol" 
                        defaultValue={initialData.rol} 
                        required 
                    />
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <SubmitButton />
            </div>
        </form>
    );
}

export default FormEditarUsuario;
