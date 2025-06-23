"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from '@/components/Loader';
import { crearDesign } from "@/app/acciones/DesignActions"; // Assuming a create action exists
import { useDialog } from "@/context/DialogContext"; // Assuming dialog context is used
import { CategoriaProducto } from "@/models/enums/CategoriaProducto"; // Import CategoriaProducto

function AddDesignPage() {
  const router = useRouter();
  const { showPopUp } = useDialog();

  const [nombreDesing, setNombreDesing] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [valorDesing, setValorDesing] = useState("");
  const [categoria, setCategoria] = useState(""); // You might need to fetch categories
  const [selectedImageFile, setSelectedImageFile] = useState(null);
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
        e.target.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`El tamaño del archivo excede el límite de ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
        setSelectedImageFile(null);
        e.target.value = '';
        return;
      }
      setError(null);
      setSelectedImageFile(file);
    } else {
      setSelectedImageFile(null);
      setError(null);
    }
  };

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
      formData.append("imagenDesing", selectedImageFile);
    }

    try {
      const result = await crearDesign(null, formData);

      if (result?.success) {
        showPopUp("Diseño agregado exitosamente", "success");
        router.push("/admin/designs"); // Redirect to designs list after successful creation
      } else {
        setError(result?.message || "Error desconocido al agregar el diseño.");
        showPopUp(result?.message || "Error desconocido al agregar el diseño.", "error");
      }
    } catch (err) {
      setError("Error de red o del servidor: " + err.message);
      showPopUp("Error de red o del servidor: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-white text-black rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Agregar Nuevo Diseño</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-black text-red-500 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="nombreDesing" className="block text-sm font-medium text-black mb-1">
            Nombre del Diseño:
          </label>
          <input
            type="text"
            id="nombreDesing"
            name="nombreDesing"
            value={nombreDesing}
            onChange={(e) => setNombreDesing(e.target.value)}
            required
            className="w-full p-3 bg-white border border-black rounded-md text-white placeholder-gray-500 focus:ring-white focus:border-white"
            placeholder="Ej: Camiseta Urbana"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-black mb-1">
            Descripción:
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 bg-white border border-black rounded-md text-white placeholder-gray-500 focus:ring-white focus:border-white"
            placeholder="Una breve descripción de tu diseño (opcional)..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="valorDesing" className="block text-sm font-medium text-black mb-1">
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
            className="w-full p-3 bg-white border border-black rounded-md text-white placeholder-gray-500 focus:ring-white focus:border-white"
            placeholder="Ej: 25.99"
          />
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-black mb-1">
            Categoría:
          </label>
          <select
            id="categoria"
            name="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="w-full p-3 bg-black border border-white rounded-md text-white focus:ring-white focus:border-white"
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
          <label htmlFor="imagenDesing" className="block text-sm font-medium text-black mb-1">
            Subir Imagen:
          </label>
          <input
            type="file"
            id="imagenDesing"
            name="imagenDesing"
            onChange={handleFileChange}
            required
            className="w-full p-3 bg-black border border-white rounded-md text-white focus:ring-white focus:border-white"
            accept="image/jpeg, image/png, image/webp"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/designs")}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
          >
            Cancelar
          </button>
          <button
            type="submit"
            aria-disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
            disabled={loading}
          >
            Guardar Diseño
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDesignPage;
