"use client";

import { useActionState, useFormStatus } from "react-dom";
import { guardarDesigns } from "@/app/acciones/DesignActions";
import { useModal } from "@/context/ModalContext";
import { usePopUp } from "@/context/PopUpContext";
import { CategoriaProducto } from "@/models/enums/CategoriaProducto"; // Assuming this path for enum

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
      disabled={pending}
    >
      {pending ? "Guardando..." : "Guardar Diseño"}
    </button>
  );
}

function DesignUploadModal({ onDesignSaved }) {
  const { closeModal } = useModal();
  const { showPopUp } = usePopUp(); // Assuming usePopUp hook exists
  const [state, formAction] = useActionState(guardarDesigns, null);

  // Handle form submission feedback
  if (state?.success) {
    showPopUp("Diseño guardado exitosamente", "success");
    closeModal();
    onDesignSaved(); // Callback to refresh designs list
    state.success = false; // Reset state to prevent re-triggering
  } else if (state?.message && state?.message !== "Usuario no autenticado.") { // Avoid showing pop-up for unauthenticated, handled by server action
    showPopUp(state.message, "error");
    state.message = null; // Reset state to prevent re-triggering
  }

  return (
    <div className="p-6 bg-black text-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Subir Nuevo Diseño</h2>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="nombreDesing" className="block text-sm font-medium text-gray-300 mb-1">
            Nombre del Diseño:
          </label>
          <input
            type="text"
            id="nombreDesing"
            name="nombreDesing"
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ej: Camiseta Urbana"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-1">
            Descripción:
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Una breve descripción de tu diseño..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="valorDesing" className="block text-sm font-medium text-gray-300 mb-1">
            Precio:
          </label>
          <input
            type="number"
            id="valorDesing"
            name="valorDesing"
            step="0.01"
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ej: 25.99"
          />
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-300 mb-1">
            Categoría:
          </label>
          <select
            id="categoria"
            name="categoria"
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Selecciona una categoría</option>
            {Object.values(CategoriaProducto).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="imagenDesing" className="block text-sm font-medium text-gray-300 mb-1">
            URL de la Imagen:
          </label>
          <input
            type="url"
            id="imagenDesing"
            name="imagenDesing"
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ej: https://ejemplo.com/mi-diseño.jpg"
          />
        </div>

        <div>
          <label htmlFor="tallasDisponibles" className="block text-sm font-medium text-gray-300 mb-1">
            Tallas Disponibles (separadas por comas):
          </label>
          <input
            type="text"
            id="tallasDisponibles"
            name="tallasDisponibles"
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ej: S, M, L, XL"
          />
        </div>

        <div>
          <label htmlFor="coloresDisponibles" className="block text-sm font-medium text-gray-300 mb-1">
            Colores Disponibles (separados por comas):
          </label>
          <input
            type="text"
            id="coloresDisponibles"
            name="coloresDisponibles"
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ej: Rojo, Azul, Negro"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
          >
            Cancelar
          </button>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

export default DesignUploadModal;
