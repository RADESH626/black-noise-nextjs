"use client";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useDialog } from "@/context/DialogContext";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import { actualizarDesign } from "@/app/acciones/DesignActions"; // Import the server action

// Submit button component with pending state
function SubmitButton({ customText = "Guardar Cambios" }) {
  const { pending } = useFormStatus();
  return (
    <BotonGeneral type="submit" disabled={pending}>
      {pending ? "Guardando..." : customText}
    </BotonGeneral>
  );
}

// Initial state for useActionState
const initialState = {
  message: null,
  success: false,
};

function FormEditarDesign({ designData, onSuccess }) {
  const { showPopUp } = useDialog();
  const [state, formAction] = useActionState(actualizarDesign, initialState);

  const [formData, setFormData] = useState({
    id: designData?._id || "",
    nombreDesing: designData?.nombreDesing || "",
    descripcion: designData?.descripcion || "",
    valorDesing: designData?.valorDesing || "",
    categoria: designData?.categoria || "",
    coloresDisponibles: designData?.coloresDisponibles?.join(',') || "",
    tallasDisponibles: designData?.tallasDisponibles?.join(',') || "",
    imagenDesing: null, // For file input
  });

  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? "success" : "error");
      if (state.success && onSuccess) {
        onSuccess(state.data); // Pass updated design data back
      }
    }
  }, [state, showPopUp, onSuccess]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagenDesing" && files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Create a FormData object for the server action
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    // Manually append the file if it exists in formData state
    if (formData.imagenDesing) {
      data.set('imagenDesing', formData.imagenDesing);
    }
    formAction(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white">
      <input type="hidden" name="id" value={formData.id} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="nombreDesing" className="block mb-1 text-sm font-medium text-purple-400">
            Nombre del Diseño
          </label>
          <input
            type="text"
            id="nombreDesing"
            name="nombreDesing"
            value={formData.nombreDesing}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="descripcion" className="block mb-1 text-sm font-medium text-purple-400">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="relative">
          <label htmlFor="valorDesing" className="block mb-1 text-sm font-medium text-purple-400">
            Valor del Diseño
          </label>
          <input
            type="number"
            id="valorDesing"
            name="valorDesing"
            value={formData.valorDesing}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
            step="0.01"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="categoria" className="block mb-1 text-sm font-medium text-purple-400">
            Categoría
          </label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="coloresDisponibles" className="block mb-1 text-sm font-medium text-purple-400">
            Colores Disponibles (separados por coma)
          </label>
          <input
            type="text"
            id="coloresDisponibles"
            name="coloresDisponibles"
            value={formData.coloresDisponibles}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="relative">
          <label htmlFor="tallasDisponibles" className="block mb-1 text-sm font-medium text-purple-400">
            Tallas Disponibles (separadas por coma)
          </label>
          <input
            type="text"
            id="tallasDisponibles"
            name="tallasDisponibles"
            value={formData.tallasDisponibles}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="relative md:col-span-2">
          <label htmlFor="imagenDesing" className="block mb-1 text-sm font-medium text-purple-400">
            Imagen del Diseño (opcional, para reemplazar)
          </label>
          <input
            type="file"
            id="imagenDesing"
            name="imagenDesing"
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            accept="image/jpeg,image/png,image/webp"
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <SubmitButton />
      </div>
    </form>
  );
}

export default FormEditarDesign;
