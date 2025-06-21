"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearDesign } from "@/app/acciones/DesignActions"; // Assuming a create action exists
import { useDialog } from "@/context/DialogContext"; // Assuming dialog context is used
<<<<<<< HEAD
import BotonGeneral from '@/components/common/botones/BotonGeneral'; // Import BotonGeneral
=======
>>>>>>> c32cb53 (primer commit)

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

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('nombreDesing', nombreDesing);
    formData.append('descripcion', descripcion);
    formData.append('valorDesing', valorDesing);
    formData.append('categoria', categoria);
    if (selectedImageFile) {
      formData.append('imagen', selectedImageFile);
    }

    try {
      const { success, message } = await crearDesign(formData);
      if (success) {
        showPopUp("Diseño agregado exitosamente!", "success");
        router.push('/admin/designs'); // Redirect to designs list
      } else {
        setError(message);
        showPopUp(message || "Error al agregar el diseño.", "error");
      }
    } catch (err) {
      console.error("Error adding design:", err);
      setError("Error de red al agregar el diseño.");
      showPopUp("Error de red al agregar el diseño.", "error");
    } finally {
      setLoading(false);
    }
  };
=======
  // You'll need a form and handleSubmit logic similar to the edit page
  // to handle input fields and call the crearDesign action.
>>>>>>> c32cb53 (primer commit)

  return (
    <div className="p-6 bg-black text-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Agregar Nuevo Diseño</h2>
<<<<<<< HEAD
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-white">Nombre del Diseño:</span>
          <input
            type="text"
            value={nombreDesing}
            onChange={(e) => setNombreDesing(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            required
          />
        </label>
        <label className="block">
          <span className="text-white">Descripción:</span>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            rows="4"
            required
          ></textarea>
        </label>
        <label className="block">
          <span className="text-white">Valor del Diseño:</span>
          <input
            type="number"
            value={valorDesing}
            onChange={(e) => setValorDesing(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            required
          />
        </label>
        <label className="block">
          <span className="text-white">Categoría:</span>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            required
          />
        </label>
        <label className="block">
          <span className="text-white">Imagen del Diseño:</span>
          <input
            type="file"
            onChange={(e) => setSelectedImageFile(e.target.files[0])}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            accept="image/*"
            required
          />
        </label>
        {error && <p className="text-red-500">{error}</p>}
        <BotonGeneral type="submit" disabled={loading} variant="primary">
          {loading ? "Guardando..." : "Guardar Diseño"}
        </BotonGeneral>
      </form>
=======
      {/* Add your form elements here */}
      <p>Formulario para agregar diseño goes here.</p>
      {/* Example form structure (needs implementation) */}
      {/*
      <form onSubmit={handleSubmit} className="space-y-4">
        ... input fields for nombreDesing, descripcion, valorDesing, categoria, imagenDesing ...
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Diseño"}
        </button>
      </form>
      */}
>>>>>>> c32cb53 (primer commit)
    </div>
  );
}

export default AddDesignPage;
