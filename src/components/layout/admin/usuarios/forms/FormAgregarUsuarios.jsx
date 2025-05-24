"use client";

import { useState } from "react";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import {
  InputTipoDocumentoIdentidad,
  InputDocumentoIdentidad,
  InputTextoGeneral,
  InputFecha,
  InputGenero,
  InputTelefono,
  InputEmail,
  InputRol,
  InputPassword
} from '@/components/common/inputs';
import { agregarUsuario } from "@/app/acciones/UsuariosActions";

function FormAgregarUsuarios({ onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = {
        tipoDocumento: e.target.tipoDocumento.value,
        numeroDocumento: e.target.numeroDocumento.value,
        primerNombre: e.target.primerNombre.value,
        segundoNombre: e.target.segundoNombre.value,
        primerApellido: e.target.primerApellido.value,
        segundoApellido: e.target.segundoApellido.value,
        fechaNacimiento: e.target.fechaNacimiento.value,
        genero: e.target.genero.value,
        numeroTelefono: e.target.telefono.value,
        rol: e.target.rol.value,
        direccion: e.target.direccion.value,
        correo: e.target.correo.value,
        contrasena: e.target.contrasena.value
      };

      await agregarUsuario(formData);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="tipoDocumento" className="block mb-1 text-sm font-medium text-purple-400">
            Tipo de Documento
          </label>
          <div className="relative">
            <InputTipoDocumentoIdentidad />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="numeroDocumento" className="block mb-1 text-sm font-medium text-purple-400">
            Número de Documento
          </label>
          <div className="relative">
            <InputDocumentoIdentidad required />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="primerNombre" className="block mb-1 text-sm font-medium text-purple-400">
            Primer nombre
          </label>
          <div className="relative">
            <InputTextoGeneral id="primerNombre" name="primerNombre" required placeholder="Primer nombre" />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="segundoNombre" className="block mb-1 text-sm font-medium text-purple-400">
            Segundo nombre
          </label>
          <div className="relative">
            <InputTextoGeneral id="segundoNombre" name="segundoNombre" placeholder="Segundo nombre (opcional)" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="primerApellido" className="block mb-1 text-sm font-medium text-purple-400">
            Primer apellido
          </label>
          <div className="relative">
            <InputTextoGeneral id="primerApellido" name="primerApellido" required placeholder="Primer apellido" />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="segundoApellido" className="block mb-1 text-sm font-medium text-purple-400">
            Segundo apellido
          </label>
          <div className="relative">
            <InputTextoGeneral id="segundoApellido" name="segundoApellido" required placeholder="Segundo apellido" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="fechaNacimiento" className="block mb-1 text-sm font-medium text-purple-400">
            Fecha de nacimiento
          </label>
          <div className="relative">
            <InputFecha id="fechaNacimiento" name="fechaNacimiento" required />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="genero" className="block mb-1 text-sm font-medium text-purple-400">
            Género
          </label>
          <div className="relative">
            <InputGenero id="genero" name="genero" required />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="telefono" className="block mb-1 text-sm font-medium text-purple-400">
            Número de teléfono
          </label>
          <div className="relative">
            <InputTelefono id="telefono" name="telefono" required />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="rol" className="block mb-1 text-sm font-medium text-purple-400">
            Rol
          </label>
          <div className="relative">
            <InputRol id="rol" name="rol" required />
          </div>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="direccion" className="block mb-1 text-sm font-medium text-purple-400">
          Dirección
        </label>
        <div className="relative">
          <InputTextoGeneral id="direccion" name="direccion" required placeholder="Dirección" />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="correo-registro" className="block mb-1 text-sm font-medium text-purple-400">
          Correo electrónico
        </label>
        <div className="relative">
          <InputEmail id="correo-registro" name="correo" required placeholder="Correo electrónico" />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="contrasena" className="block mb-1 text-sm font-medium text-purple-400">
          Contraseña
        </label>
        <div className="relative">
          <InputPassword id="contrasena" name="contrasena" required placeholder="Contraseña" />
        </div>
      </div>

      <div className="flex flex-row gap-2 items-center justify-center mt-5">
        <BotonGeneral type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear usuario'}
        </BotonGeneral>
      </div>
    </form>
  );
}

export default FormAgregarUsuarios;
