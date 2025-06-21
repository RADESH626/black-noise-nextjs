"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { encontrarDesignsPorId, actualizarDesign } from "@/app/acciones/DesignActions";
import { useDialog } from "@/context/DialogContext";
import { CategoriaProducto } from "@/models/enums/CategoriaProducto";
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function EditDesignPage({ params }) {
  const router = useRouter();
  const { showPopUp } = useDialog();
  const designId = React.use(params).id;

  const [nombreDesing, setNombreDesing] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [valorDesing, setValorDesing] = useState("");
  const [categoria, setCategoria] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [initialImagePreview, setInitialImagePreview] = useState("");
  const [optimisticImagePreview, setOptimisticImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const previousDesignStateRef = useRef(null); // To store state for rollback

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
            const imageUrl = `data:${design.imageMimeType};base64,${base64Image}`;
            setInitialImagePreview(imageUrl);
            previousDesignStateRef.current = { ...design, imageUrl }; // Store initial state
          } else {
            previousDesignStateRef.current = { ...design, imageUrl: "" };
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
        setOptimisticImagePreview(null);
        e.target.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`El tamaño del archivo excede el límite de ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
        setSelectedImageFile(null);
        setOptimisticImagePreview(null);
        e.target.value = '';
        return;
      }
      setError(null);

      // Optimistically update image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setOptimisticImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedImageFile(file);
    } else {
      setSelectedImageFile(null);
      setOptimisticImagePreview(null);
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Store current state for potential rollback
    const currentDesignState = {
      nombreDesing,
      descripcion,
      valorDesing,
      categoria,
      imageUrl: optimisticImagePreview || initialImagePreview,
    };
    previousDesignStateRef.current = currentDesignState;

    // Optimistically update UI
    const newNombreDesing = nombreDesing;
    const newDescripcion = descripcion;
    const newValorDesing = valorDesing;
    const newCategoria = categoria;
    const newImagePreview = optimisticImagePreview || initialImagePreview;

    setNombreDesing(newNombreDesing);
    setDescripcion(newDescripcion);
    setValorDesing(newValorDesing);
    setCategoria(newCategoria);
    setInitialImagePreview(newImagePreview); // Update the main image preview

    const formData = new FormData();
    formData.append("id", designId);
    formData.append("nombreDesing", newNombreDesing);
    formData.append("descripcion", newDescripcion);
    formData.append("valorDesing", newValorDesing);
    formData.append("categoria", newCategoria);

    if (selectedImageFile) {
      formData.append("imagenDesing", selectedImageFile);
    }

    try {
      const result = await actualizarDesign(null, formData);

      if (result?.success) {
        showPopUp("Diseño actualizado exitosamente", "success");
        setOptimisticImagePreview(null); // Clear optimistic state
        // No need to router.push if we want to stay on the page and see updates
        // router.push("/admin/designs");
      } else {
        setError(result?.message || "Error desconocido al actualizar el diseño.");
        showPopUp(result?.message || "Error desconocido al actualizar el diseño.", "error");
        // Rollback to previous state
        if (previousDesignStateRef.current) {
          setNombreDesing(previousDesignStateRef.current.nombreDesing);
          setDescripcion(previousDesignStateRef.current.descripcion);
          setValorDesing(previousDesignStateRef.current.valorDesing);
          setCategoria(previousDesignStateRef.current.categoria);
          setInitialImagePreview(previousDesignStateRef.current.imageUrl);
        }
      }
    } catch (err) {
      setError("Error de red o del servidor: " + err.message);
      showPopUp("Error de red o del servidor: " + err.message, "error");
      // Rollback to previous state
      if (previousDesignStateRef.current) {
        setNombreDesing(previousDesignStateRef.current.nombreDesing);
        setDescripcion(previousDesignStateRef.current.descripcion);
        setValorDesing(previousDesignStateRef.current.valorDesing);
        setCategoria(previousDesignStateRef.current.categoria);
        setInitialImagePreview(previousDesignStateRef.current.imageUrl);
      }
    } finally {
      setLoading(false);
      setSelectedImageFile(null); // Clear selected file after submission attempt
    }
  };

  const displayImage = optimisticImagePreview || initialImagePreview;

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
          {displayImage && (
            <div className="mb-2">
              <p className="text-sm text-gray-400">Imagen actual:</p>
              <img src={displayImage} alt="Current Design" className="h-24 w-24 object-cover rounded-md" />
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
          <BotonGeneral
            type="button"
            onClick={() => router.push("/admin/designs")}
            variant="secondary"
            className="transition duration-200 ease-in-out"
          >
            Cancelar
          </BotonGeneral>
          <BotonGeneral
            type="submit"
            disabled={loading}
            variant="primary"
            className="transition duration-200 ease-in-out"
          >
            {loading ? "Actualizando..." : "Actualizar Diseño"}
          </BotonGeneral>
        </div>
      </form>
    </div>
  );
}

export default EditDesignPage;
