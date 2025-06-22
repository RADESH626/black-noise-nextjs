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

  console.log(`--- [SERVIDOR] Obteniendo datos para el usuario: ${userId} ---`);

  let initialUserPayments = [];
  let initialUserDesigns = [];

  if (userId) {
    const { designs } = await obtenerDesignsPorUsuarioId(userId);
    if (designs) {
      initialUserDesigns = designs;
    }

    const { pagos } = await obtenerPagosPorUsuarioId(userId);
    if (pagos) {
      initialUserPayments = pagos;
    }
  }
  
  console.log('--- [SERVIDOR] FIN DE DEBUGGING ---');

  return (
      <ProfileContent
        initialUserDesigns={initialUserDesigns}
        initialUserPayments={initialUserPayments}
      />
  );
}

export default ProfilePage;
