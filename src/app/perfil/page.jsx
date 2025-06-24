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
  const [userData, userDesignsData, userPaymentsData, userOrdersData] = await Promise.all([
    ObtenerUsuarioPorId(userId),
    obtenerDesignsPorUsuarioId(userId),
    obtenerPagosPorUsuarioId(userId),
    obtenerPedidosPorUsuarioId(userId) // Obtener pedidos del usuario
  ]);

  const user = userData && !userData.error ? userData : null;
  const designs = userDesignsData && !userDesignsData.error ? userDesignsData.designs : [];
  const payments = userPaymentsData && !userPaymentsData.error ? userPaymentsData.pagos : [];
  const orders = userOrdersData && userOrdersData.success ? userOrdersData.pedidos : []; // Obtener pedidos

  return (
      <ProfileContent
        userId={userId}
        initialUser={user}
        initialDesigns={designs}
        initialPayments={payments}
        initialPedidos={orders} // Pasar los pedidos al componente
      />
  );
}

export default ProfilePage;
