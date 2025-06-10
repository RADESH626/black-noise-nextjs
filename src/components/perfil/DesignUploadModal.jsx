"use client";

import { useState, useEffect } from "react"; // Import useState and useEffect
import { guardarDesigns } from "@/app/acciones/DesignActions";
import { useModal } from "@/context/ModalContext";
import { usePopUp } from "@/context/PopUpContext";
import { CategoriaProducto } from "@/models/enums/CategoriaProducto"; // Assuming this path for enum

function DesignUploadModal({ onDesignSaved }) {
  const { closeModal } = useModal();
  const { showPopUp } = usePopUp();

  // State for form fields
  const [nombreDesing, setNombreDesing] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [valorDesing, setValorDesing] = useState("");
  const [categoria, setCategoria] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null); // State for the selected file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("nombreDesing", nombreDesing);
    formData.append("descripcion", descripcion);
    formData.append("valorDesing", valorDesing);
    formData.append("categoria", categoria);
    if (selectedImageFile) {
      formData.append("imagenDesing", selectedImageFile); // Append the File object
    }

    try {
      const result = await guardarDesigns(null, formData); // Pass null for prevState as it's not used in this context

      if (result?.success) {
        showPopUp("Diseño guardado exitosamente", "success");
        closeModal();
        onDesignSaved(); // Callback to refresh designs list
        // Reset form fields
        setNombreDesing("");
        setDescripcion("");
        setValorDesing("");
        setCategoria("");
        setSelectedImageFile(null); // Reset file input
      } else {
        setError(result?.message || "Error desconocido al guardar el diseño.");
        showPopUp(result?.message || "Error desconocido al guardar el diseño.", "error");
      }
    } catch (err) {
      setError("Error de red o del servidor: " + err.message);
      showPopUp("Error de red o del servidor: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-black text-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Subir Nuevo Diseño</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombreDesing" className="block text-sm font-medium text-gray-300 mb-1">
            Nombre del Diseño:
          </label>
          <input
            type="text"
            id="nombreDesing"
            name="nombreDesing"
            value={nombreDesing}
            onChange={(e) => setNombreDesing(e.target.value)}
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
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Una breve descripción de tu diseño (opcional)..."
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
            value={valorDesing}
            onChange={(e) => setValorDesing(e.target.value)}
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
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
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
            Subir Imagen:
          </label>
          <input
            type="file"
            id="imagenDesing"
            name="imagenDesing"
            onChange={(e) => setSelectedImageFile(e.target.files[0])} // Store the File object
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
            accept="image/*" // Accept only image files
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
          <button
            type="submit"
            aria-disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Diseño"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DesignUploadModal;
