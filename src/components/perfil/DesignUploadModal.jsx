"use client";

import { useState, useEffect } from "react";
import { guardarDesigns } from "@/app/acciones/DesignActions";
import { useDialog } from "@/context/DialogContext";
import { CategoriaProducto } from "@/models/enums/CategoriaProducto";
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function DesignUploadModal({ onDesignSaved }) {
  const { closeModal, showPopUp } = useDialog();

  const [nombreDesing, setNombreDesing] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [valorDesing, setValorDesing] = useState("");
  const [categoria, setCategoria] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 15 * 1024 * 1024;

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

    if (!selectedImageFile) {
      setError("Por favor, selecciona una imagen para el diseño.");
      setLoading(false);
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(selectedImageFile.type)) {
      setError(`Tipo de archivo no soportado: ${selectedImageFile.type}.`);
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
    formData.append("imagenDesing", selectedImageFile);

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
    <div className="p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto" style={{ backgroundColor: "#111827", color: "#FFFFFF" }}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md text-sm mb-4" style={{ backgroundColor: "#991B1B", color: "#FFFFFF" }}>
            {error}
          </div>
        )}

        <div>
          <label htmlFor="nombreDesing" className="block text-sm font-medium mb-1" style={{ color: "#D1D5DB" }}>
            Nombre del Diseño:
          </label>
          <input
            type="text"
            id="nombreDesing"
            name="nombreDesing"
            value={nombreDesing}
            onChange={(e) => setNombreDesing(e.target.value)}
            required
            className="w-full p-3 border rounded-md focus:ring-2 focus:outline-none"
            style={{
              backgroundColor: "#1F2937",
              borderColor: "#FFFFFFFF",
              color: "#FFFFFF",
              placeholderColor: "#6B7280"
            }}
            placeholder="Ej: Camiseta Urbana"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium mb-1" style={{ color: "#D1D5DB" }}>
            Descripción:
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:outline-none"
            style={{
              backgroundColor: "#1F2937",
              borderColor: "#FFFFFFFF",
              color: "#FFFFFF",
              placeholderColor: "#6B7280"
            }}
            placeholder="Una breve descripción de tu diseño (opcional)..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="valorDesing" className="block text-sm font-medium mb-1" style={{ color: "#D1D5DB" }}>
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
            className="w-full p-3 border rounded-md focus:ring-2 focus:outline-none"
            style={{
              backgroundColor: "#1F2937",
              borderColor: "#FFFFFFFF",
              color: "#FFFFFF",
              placeholderColor: "#6B7280"
            }}
            placeholder="Ej: 25.99"
          />
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-medium mb-1" style={{ color: "#D1D5DB" }}>
            Categoría:
          </label>
          <select
            id="categoria"
            name="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="w-full p-3 border rounded-md focus:ring-2 focus:outline-none"
            style={{
              backgroundColor: "#1F2937",
              borderColor: "#FFFFFFFF",
              color: "#FFFFFF"
            }}
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
          <label htmlFor="imagenDesing" className="block text-sm font-medium mb-1" style={{ color: "#D1D5DB" }}>
            Subir Imagen:
          </label>
          <input
            type="file"
            id="imagenDesing"
            name="imagenDesing"
            onChange={handleFileChange}
            required
            accept="image/jpeg, image/png, image/webp"
            className="w-full p-3 border rounded-md focus:ring-2 focus:outline-none"
            style={{
              backgroundColor: "#1F2937",
              borderColor: "#FFFFFFFF",
              color: "#FFFFFF"
            }}
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <BotonGeneral
            type="button"
            onClick={closeModal}
            variant="secondary"
          >
            Cancelar
          </BotonGeneral>
          <BotonGeneral
            type="submit"
            disabled={loading}
            variant="primary"
          >
            {loading ? "Guardando..." : "Guardar Diseño"}
          </BotonGeneral>
        </div>
      </form>
    </div>
  );
}

export default DesignUploadModal;
