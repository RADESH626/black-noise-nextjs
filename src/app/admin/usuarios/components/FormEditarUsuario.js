"use client";

import { useState, useEffect } from "react";
import { getUserData } from "../actions/getUserData";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import {
  InputTipoDocumentoIdentidad,
  InputDocumentoIdentidad,
  InputTextoGeneral,
  InputFecha,
  InputGenero,
  InputTelefono,
  InputEmail,
  InputRol
} from '@/components/common/inputs';

function FormEditarUsuario({ UserId, usuarioId, isProfile }) {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const id = UserId || usuarioId;

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setIsLoading(true);
        const plainData = await getUserData(id);
        setFormData(plainData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUsuario();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-red-500 text-center p-4">
        Error cargando datos del usuario
      </div>
    );
  }

  return (
    <form className="space-y-5 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="tipoDocumento" className="block mb-1 text-sm font-medium text-purple-400">
            Tipo de Documento
          </label>
          <div className="relative">
            <InputTipoDocumentoIdentidad defaultValue={formData.tipoDocumento || ""} />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="numeroDocumento" className="block mb-1 text-sm font-medium text-purple-400">
            Número de Documento
          </label>
          <div className="relative">
            <InputDocumentoIdentidad required defaultValue={formData.numeroDocumento || ""} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="primerNombre" className="block mb-1 text-sm font-medium text-purple-400">
            Primer nombre
          </label>
          <div className="relative">
            <InputTextoGeneral id="primerNombre" name="primerNombre" required placeholder="Primer nombre" defaultValue={formData.primerNombre || ""} />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="segundoNombre" className="block mb-1 text-sm font-medium text-purple-400">
            Segundo nombre
          </label>
          <div className="relative">
            <InputTextoGeneral id="segundoNombre" name="segundoNombre" required placeholder="Segundo nombre (opcional)" defaultValue={formData.segundoNombre || ""} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="primerApellido" className="block mb-1 text-sm font-medium text-purple-400">
            Primer apellido
          </label>
          <div className="relative">
            <InputTextoGeneral id="primerApellido" name="primerApellido" required placeholder="Primer apellido" defaultValue={formData.primerApellido || ""} />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="segundoApellido" className="block mb-1 text-sm font-medium text-purple-400">
            Segundo apellido
          </label>
          <div className="relative">
            <InputTextoGeneral id="segundoApellido" name="segundoApellido" required placeholder="Segundo apellido" defaultValue={formData.segundoApellido || ""} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="fechaNacimiento" className="block mb-1 text-sm font-medium text-purple-400">
            Fecha de nacimiento
          </label>
          <div className="relative">
            <InputFecha
              id="fechaNacimiento"
              name="fechaNacimiento"
              required
              defaultValue={
                formData.fechaNacimiento
                  ? new Date(formData.fechaNacimiento).toISOString().split('T')[0]
                  : ""
              }
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="genero" className="block mb-1 text-sm font-medium text-purple-400">
            Género
          </label>
          <div className="relative">
            <InputGenero id="genero" name="genero" required defaultValue={formData.genero || ""} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="telefono" className="block mb-1 text-sm font-medium text-purple-400">
            Número de teléfono
          </label>
          <div className="relative">
            <InputTelefono id="telefono" name="telefono" required defaultValue={formData.numeroTelefono || ""} />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="rol" className="block mb-1 text-sm font-medium text-purple-400">
            Rol
          </label>
          <div className="relative">
            <InputRol id="rol" name="rol" required defaultValue={formData.rol || ""} />
          </div>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="direccion" className="block mb-1 text-sm font-medium text-purple-400">
          Dirección
        </label>
        <div className="relative">
          <InputTextoGeneral id="direccion" name="direccion" required placeholder="Dirección" defaultValue={formData.direccion || ""} />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="correo-registro" className="block mb-1 text-sm font-medium text-purple-400">
          Correo electrónico
        </label>
        <div className="relative">
          <InputEmail id="correo-registro" name="correo" required placeholder="Correo electrónico" defaultValue={formData.correo || ""} />
        </div>
      </div>

      <div className="flex flex-row gap-2 items-center justify-center mt-5">
        <BotonGeneral>
          {isProfile ? 'Guardar cambios' : 'Editar usuario'}
        </BotonGeneral>
      </div>
    </form>
  );
}

export default FormEditarUsuario;
