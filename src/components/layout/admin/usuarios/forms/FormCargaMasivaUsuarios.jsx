"use client";

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { usePopUp } from '@/context/PopUpContext';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
// Import the Server Action for bulk upload
import { bulkUploadUsersAction } from '@/app/acciones/UsuariosActions';

// Component for the submit button with pending state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <BotonGeneral type="submit" disabled={pending}>
      {pending ? 'Cargando...' : 'Cargar Archivo'}
    </BotonGeneral>
  );
}

// Initial state for useActionState
const initialState = {
  message: null,
  success: false,
};

function FormCargaMasivaUsuarios() {
  const { showPopUp } = usePopUp();

  // Use useActionState to manage the state of the action
  // Use useActionState with the actual bulk upload Server Action
  const [state, formAction] = useActionState(bulkUploadUsersAction, initialState);

  // Effect to show pop-up based on the state
  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? 'success' : 'error');
    }
  }, [state, showPopUp]);

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-2xl border border-purple-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">Carga Masiva de Usuarios</h2>
      {/* Form element with action prop */}
      <form action={formAction} className="space-y-4">
        <div className="relative">
          <label htmlFor="bulkFile" className="block text-sm font-medium text-purple-400 mb-2">
            Seleccionar archivo (.csv)
          </label>
          <input
            type="file"
            id="bulkFile"
            name="bulkFile" // Name is crucial for FormData
            accept=".csv" // Accept only CSV files
            required
            className="block w-full text-sm text-white
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-500 file:text-white
              hover:file:bg-purple-600"
          />
        </div>

        <div className="flex justify-center">
          {/* Use the SubmitButton component */}
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

export default FormCargaMasivaUsuarios;
