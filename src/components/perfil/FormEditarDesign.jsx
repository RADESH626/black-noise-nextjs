"use client";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useDialog } from "@/context/DialogContext";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import InputGeneral from "@/components/common/inputs/InputGeneral";
import InputFiles from "@/components/common/inputs/InputFiles";
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
        <InputGeneral
          label="Nombre del Diseño"
          id="nombreDesing"
          name="nombreDesing"
          type="text"
          value={formData.nombreDesing}
          onChange={handleChange}
          required
        />

        <InputGeneral
          label="Descripción"
          id="descripcion"
          name="descripcion"
          type="textarea"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />

        <InputGeneral
          label="Valor del Diseño"
          id="valorDesing"
          name="valorDesing"
          type="number"
          value={formData.valorDesing}
          onChange={handleChange}
          step="0.01"
          required
        />

        <InputGeneral
          label="Categoría"
          id="categoria"
          name="categoria"
          type="text"
          value={formData.categoria}
          onChange={handleChange}
          required
        />

        <InputGeneral
          label="Tallas Disponibles (separadas por comas)"
          id="tallasDisponibles"
          name="tallasDisponibles"
          type="text"
          value={formData.tallasDisponibles}
          onChange={handleChange}
          required
        />

        <div className="relative md:col-span-2">
          <label htmlFor="imagenDesing" className="block mb-1 text-sm font-medium text-purple-400">
            Imagen del Diseño (opcional, para reemplazar)
          </label>
          <InputFiles
            id="imagenDesing"
            name="imagenDesing"
            onChange={handleChange}
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
