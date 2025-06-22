import ProfileContent from "@/components/layout/ProfileContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { obtenerPedidosPorUsuarioId } from "@/app/acciones/PedidoActions";
import { obtenerDesignsPorUsuarioId } from "@/app/acciones/DesignActions";
import { obtenerPagosPorUsuarioId } from "@/app/acciones/PagoActions";
import { ObtenerUsuarioPorId } from "@/app/acciones/UsuariosActions";
async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return <p>Por favor, inicia sesión para ver tu perfil.</p>;
  }

  const userId = session.user.id;

  // Obtener datos en el Server Component
  const [userData, userDesignsData, userPaymentsData] = await Promise.all([
    ObtenerUsuarioPorId(userId),
    obtenerDesignsPorUsuarioId(userId),
    obtenerPagosPorUsuarioId(userId)
  ]);

  const user = userData && !userData.error ? userData : null;
  const designs = userDesignsData && !userDesignsData.error ? userDesignsData.designs : [];
  const payments = userPaymentsData && !userPaymentsData.error ? userPaymentsData.pagos : [];

  return (
      <ProfileContent
        userId={userId}
        initialUser={user}
        initialDesigns={designs}
        initialPayments={payments}
      />
  );
}

export default ProfilePage;
