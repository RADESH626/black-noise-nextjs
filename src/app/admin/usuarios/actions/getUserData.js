"use client";

import { ObtenerUsuarioPorId } from "@/app/acciones/UsuariosActions";

export async function getUserData(id) {
  try {
    return await ObtenerUsuarioPorId(id);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
