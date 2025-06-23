"use client";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useDialog } from "@/context/DialogContext";
import BotonGeneral from "@/components/common/botones/BotonGeneral"; // Assuming this component exists
import { updateUserAction } from "@/app/acciones/UsuariosActions"; // Import the server action
import Image from "next/image"; // Import Image component

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

function FormEditarUsuario({ userData, userId, onSuccess }) {
  const { showPopUp } = useDialog();
  const [state, formAction] = useActionState(updateUserAction.bind(null, userId), initialState);

  // State for form fields, initialized with userData
  const [formData, setFormData] = useState({
    tipoDocumento: userData?.tipoDocumento || "",
    numeroDocumento: userData?.numeroDocumento || "",
    primerNombre: userData?.primerNombre || "",
    segundoNombre: userData?.segundoNombre || "",
    primerApellido: userData?.primerApellido || "",
    segundoApellido: userData?.segundoApellido || "",
    fechaNacimiento: userData?.fechaNacimiento || "",
    genero: userData?.genero || "",
    numeroTelefono: userData?.numeroTelefono || "",
    direccion: userData?.direccion || "",
    correo: userData?.correo || "",
    rol: userData?.rol || "", // Assuming rol can be edited or needs to be passed
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(userData?.profileImageUrl || "/img/perfil/FotoPerfil.webp"); // Default image if none exists

  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? "success" : "error");
      if (state.success && onSuccess) {
        onSuccess();
      }
    }
  }, [state, showPopUp, onSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setProfileImageFile(null);
      setProfileImagePreview(userData?.profileImageUrl || "/img/perfil/FotoPerfil.webp");
    }
  };

  const handleSubmit = (event) => {
    const data = new FormData(event.target);
    if (profileImageFile) {
      data.append('profileImage', profileImageFile);
    }
    formAction(data);
  };

  return (
    <form action={handleSubmit} className="space-y-5 text-white">
      {/* Profile Image Preview */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600 mb-4">
          <Image
            src={profileImagePreview}
            alt="Profile Preview"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <label htmlFor="profileImage" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out">
          Cambiar Imagen de Perfil
        </label>
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="tipoDocumento" className="block mb-1 text-sm font-medium text-white">
            Tipo de Documento
          </label>
          <select
            id="tipoDocumento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black  focus:border-white"
            required
          >
            <option value="">Seleccione</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="PASAPORTE">Pasaporte</option>
          </select>
        </div>

        <div className="relative">
          <label htmlFor="numeroDocumento" className="block mb-1 text-sm font-medium text-white">
            Número de Documento
          </label>
          <input
            type="text"
            id="numeroDocumento"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black  focus:border-white"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="primerNombre" className="block mb-1 text-sm font-medium text-white">
            Primer Nombre
          </label>
          <input
            type="text"
            id="primerNombre"
            name="primerNombre"
            value={formData.primerNombre}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black  focus:border-white"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="segundoNombre" className="block mb-1 text-sm font-medium text-white">
            Segundo Nombre
          </label>
          <input
            type="text"
            id="segundoNombre"
            name="segundoNombre"
            value={formData.segundoNombre}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black  focus:border-white"
          />
        </div>

        <div className="relative">
          <label htmlFor="primerApellido" className="block mb-1 text-sm font-medium text-white">
            Primer Apellido
          </label>
          <input
            type="text"
            id="primerApellido"
            name="primerApellido"
            value={formData.primerApellido}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black  focus:border-white"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="segundoApellido" className="block mb-1 text-sm font-medium text-white">
            Segundo Apellido
          </label>
          <input
            type="text"
            id="segundoApellido"
            name="segundoApellido"
            value={formData.segundoApellido}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black  focus:border-white"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="fechaNacimiento" className="block mb-1 text-sm font-medium text-white">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black  focus:border-white"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="genero" className="block mb-1 text-sm font-medium text-white">
            Género
          </label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black focus:border-white"
            required
          >
            <option value="">Seleccione</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <div className="relative">
          <label htmlFor="numeroTelefono" className="block mb-1 text-sm font-medium text-white">
            Número de Teléfono
          </label>
          <input
            type="text"
            id="numeroTelefono"
            name="numeroTelefono"
            value={formData.numeroTelefono}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black focus:border-white"
            required
          />
        </div>

        <div className="relative md:col-span-2">
          <label htmlFor="direccion" className="block mb-1 text-sm font-medium text-white">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black focus:border-white"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="correo" className="block mb-1 text-sm font-medium text-white">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-black focus:border-white"
            required
          />
        </div>

        {/* Hidden field for rol, as it's part of the user model but might not be directly editable by user */}
        <input type="hidden" name="rol" value={formData.rol} />
      </div>

      <div className="flex justify-center mt-6">
        <SubmitButton />
      </div>
    </form>
  );
}

export default FormEditarUsuario;
