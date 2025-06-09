"use client";
import { useEffect } from "react";
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { usePopUp } from '@/context/PopUpContext';
import { FiltrarUsuarios } from '@/app/acciones/UsuariosActions';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import Input from '@/components/common/inputs/InputGeneral';

function SubmitButton({ customText = 'Buscar' }) {
  const { pending } = useFormStatus();
  return (
    <BotonGeneral type="submit" disabled={pending}>
      {pending ? 'Buscando...' : customText}
    </BotonGeneral>
  );
}

const initialState = {
  message: null,
  success: false,
  data: [],
};

function FormBuscarUsuario({ onSearchSuccess }) {
  const { showPopUp } = usePopUp();
  const [state, formAction] = useActionState(FiltrarUsuarios, initialState);

  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? 'success' : 'error');
    }
    if (state.success && onSearchSuccess) {
      onSearchSuccess(state.data);
    }
  }, [state, showPopUp, onSearchSuccess]);

  return (
    <form action={formAction} className="space-y-5 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="searchText" className="block mb-1 text-sm font-medium text-purple-400">
            Buscar Usuario
          </label>
          <Input
            type="text"
            id="searchText"
            name="searchText"
            placeholder="Nombre, correo, documento..."
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          />
        </div>
      </div>
      <SubmitButton />
    </form>
  );
  }

export default FormBuscarUsuario;
