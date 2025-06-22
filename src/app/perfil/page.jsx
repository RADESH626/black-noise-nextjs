"use client";
import ProfileContent from "@/components/layout/ProfileContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { obtenerPedidosPorUsuarioId } from "@/app/acciones/PedidoActions";
import { obtenerDesignsPorUsuarioId } from "@/app/acciones/DesignActions";
import { obtenerPagosPorUsuarioId } from "@/app/acciones/PagoActions";
async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return <p>Por favor, inicia sesión para ver tu perfil.</p>;
  }

  const userId = session.user.id;

  return (
      <ProfileContent
        userId={userId}
      />
  );
}

export default ProfilePage;
