"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { encontrarDesignsPorId, actualizarDesign } from "@/app/acciones/DesignActions";
import { usePopUp } from "@/context/PopUpContext";
import { CategoriaProducto } from "@/models/enums/CategoriaProducto";

function EditDesignPage({ params }) {
  const router = useRouter();
  const { showPopUp } = usePopUp();
  const designId = params.id;

  const [nombreDesing, setNombreDesing] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [valorDesing, setValorDesing] = useState("");
  const [categoria, setCategoria] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [initialImagePreview, setInitialImagePreview] = useState(""); // To display existing image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

  useEffect(() => {
    async function fetchDesign() {
      if (!designId) return;

      try {
        setLoading(true);
        const result = await encontrarDesignsPorId(designId);
        if (result?.data) {
          const design = result.data;
          setNombreDesing(design.nombreDesing);
          setDescripcion(design.descripcion);
          setValorDesing(design.valorDesing);
          setCategoria(design.categoria);
          if (design.imageData && design.imageMimeType) {
            const base64Image = Buffer.from(design.imageData.data).toString('base64');
            setInitialImagePreview(`data:${design.imageMimeType};base64,${base64Image}`);
          }
        } else {
          setError(result?.error || "Diseño no encontrado.");
          showPopUp(result?.error || "Diseño no encontrado.", "error");
        }
      } catch (err) {
        setError("Error al cargar el diseño: " + err.message);
        showPopUp("Error al cargar el diseño: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchDesign();
  }, [designId, showPopUp]);

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

    const formData = new FormData();
    formData.append("id", designId); // Important: append the design ID for update
    formData.append("nombreDesing", nombreDesing);
    formData.append("descripcion", descripcion);
    formData.append("valorDesing", valorDesing);
    formData.append("categoria", categoria);

    if (selectedImageFile) {
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
      formData.append("imagenDesing", selectedImageFile); // Append the new File object
    }

    try {
      const result = await actualizarDesign(null, formData);

      if (result?.success) {
        showPopUp("Diseño actualizado exitosamente", "success");
        router.push("/admin"); // Redirect back to designs list
      } else {
        setError(result?.message || "Error desconocido al actualizar el diseño.");
        showPopUp(result?.message || "Error desconocido al actualizar el diseño.", "error");
      }
    } catch (err) {
      setError("Error de red o del servidor: " + err.message);
      showPopUp("Error de red o del servidor: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Cargando diseño...</div>;
  }

  return (
    <div className="p-6 bg-black text-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Editar Diseño</h2>
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
            Subir Nueva Imagen:
          </label>
          {initialImagePreview && (
            <div className="mb-2">
              <p className="text-sm text-gray-400">Imagen actual:</p>
              <img src={initialImagePreview} alt="Current Design" className="h-24 w-24 object-cover rounded-md" />
            </div>
          )}
          <input
            type="file"
            id="imagenDesing"
            name="imagenDesing"
            onChange={handleFileChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
            accept="image/jpeg, image/png, image/webp"
          />
          <p className="text-xs text-gray-400 mt-1">Deja en blanco para mantener la imagen actual.</p>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/designs")}
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
            {loading ? "Actualizando..." : "Actualizar Diseño"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDesignPage;
