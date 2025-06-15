"use client";
import { useEffect } from "react";
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { usePopUp } from '@/context/PopUpContext';
import { FiltrarUsuarios } from '@/app/acciones/UsuariosActions';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import InputGeneral from '@/components/common/inputs/InputGeneral';

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
    <form action={formAction} className="space-y-5 text-[#FFFFFF]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label
            htmlFor="searchText"
            className="block mb-1 text-sm font-medium"
            style={{ color: '#FFFFFFFF' }}
          >
            Buscar Usuario
          </label>
          <InputGeneral
            type="text"
            id="searchText"
            name="searchText"
            placeholder="Nombre, correo, documento..."
            className="w-full p-2 rounded bg-[#374151] border border-[#ffffff] focus:border-[#8a8c94] focus:ring focus:ring-[#ffffff] focus:ring-opacity-50"
          />
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}

export default FormBuscarUsuario;
