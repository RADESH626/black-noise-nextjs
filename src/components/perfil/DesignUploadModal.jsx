"use client";

import { useState, useEffect } from "react"; // Import useState and useEffect
import { guardarDesigns } from "@/app/acciones/DesignActions";
import { useDialog } from "@/context/DialogContext";
import { CategoriaProducto } from "@/models/enums/CategoriaProducto"; // Assuming this path for enum

function DesignUploadModal({ onDesignSaved }) {
  const { closeModal, showPopUp } = useDialog();

  // State for form fields
  const [nombreDesing, setNombreDesing] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [valorDesing, setValorDesing] = useState("");
  const [categoria, setCategoria] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null); // State for the selected file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError(`Tipo de archivo no soportado: ${file.type}. Solo se permiten JPG, PNG y WEBP.`);
        setSelectedImageFile(null);
        e.target.value = ''; // Clear the file input
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`El tamaño del archivo excede el límite de ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
        setSelectedImageFile(null);
        e.target.value = ''; // Clear the file input
        return;
      }
      setError(null); // Clear previous errors if file is valid
      setSelectedImageFile(file);
    } else {
      setSelectedImageFile(null);
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null); // Clear errors before submission

    if (!selectedImageFile) {
      setError("Por favor, selecciona una imagen para el diseño.");
      setLoading(false);
      return;
    }

    // Re-validate just in case (though handleFileChange should catch most)
    if (!ALLOWED_MIME_TYPES.includes(selectedImageFile.type)) {
      setError(`Tipo de archivo no soportado: ${selectedImageFile.type}. Solo se permiten JPG, PNG y WEBP.`);
      setLoading(false);
      return;
    }
    if (selectedImageFile.size > MAX_FILE_SIZE) {
      setError(`El tamaño del archivo excede el límite de ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("nombreDesing", nombreDesing);
    formData.append("descripcion", descripcion);
    formData.append("valorDesing", valorDesing);
    formData.append("categoria", categoria);
    formData.append("imagenDesing", selectedImageFile); // Append the File object

    try {
      const result = await guardarDesigns(null, formData);

      if (result?.success) {
        showPopUp("Diseño guardado exitosamente", "success");
        closeModal();
        onDesignSaved();
        setNombreDesing("");
        setDescripcion("");
        setValorDesing("");
        setCategoria("");
        setSelectedImageFile(null);
        // Clear the file input visually
        const fileInput = document.getElementById('imagenDesing');
        if (fileInput) fileInput.value = '';
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
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Subir Nuevo Diseño</h2> */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-800 text-white p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
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
            onChange={handleFileChange}
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
            accept="image/jpeg, image/png, image/webp" // Accept only specified image files
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
