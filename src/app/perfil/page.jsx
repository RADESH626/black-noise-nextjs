import ProfileContent from "@/components/layout/ProfileContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { obtenerPedidosPorUsuarioId } from "@/app/acciones/PedidoActions";
import { obtenerDesignsPorUsuarioId } from "@/app/acciones/DesignActions";
import { obtenerPagosPorUsuarioId } from "@/app/acciones/PagoActions"; // Importar la nueva acción
import PageLayout from "@/components/layout/PageLayout";

async function ProfilePage() {
  // 1. Obtenemos la sesión primero
  const session = await getServerSession(authOptions);

  // 2. Ahora sí validamos si existe la sesión
  if (!session || !session.user) {
    return <p>Por favor, inicia sesión para ver tu perfil.</p>;
  }

  const userId = session.user.id;

  // --- INICIO DE DEBUGGING EN SERVIDOR ---
  console.log(`--- [SERVIDOR] Obteniendo datos para el usuario: ${userId} ---`);

  let initialOrderedDesignIds = [];
  let initialUserDesigns = [];
  let initialUserPayments = []; // Nueva variable para los pagos

  if (userId) {
    // Corregido de "orders" a "pedidos" para que coincida con lo que devuelve la función
    const { pedidos } = await obtenerPedidosPorUsuarioId(userId);
    
    // Log para ver los pedidos crudos que llegan de la base de datos
    console.log('[SERVIDOR] Pedidos obtenidos:', JSON.stringify(pedidos, null, 2));

    if (pedidos && pedidos.length > 0) {
      const designIds = new Set();
      pedidos.forEach(pedido => {
        // Asegurarse de que el pedido tiene items antes de iterar
        if (pedido.items && Array.isArray(pedido.items)) {
          pedido.items.forEach(item => {
            // Asegurarse de que item.designId no sea null y tenga un _id
            if (item.designId && item.designId._id) {
              designIds.add(item.designId._id.toString());
            }
          });
        }
      });
      initialOrderedDesignIds = Array.from(designIds);
    }
    
    // Log para ver el array final de IDs que se pasará al cliente
    console.log('[SERVIDOR] Array de IDs de diseños en pedidos:', initialOrderedDesignIds);

    const { designs } = await obtenerDesignsPorUsuarioId(userId);
    if (designs) {
      initialUserDesigns = designs;
    }

    // Obtener el historial de pagos
    const { pagos } = await obtenerPagosPorUsuarioId(userId);
    if (pagos) {
      initialUserPayments = pagos;
    }
  }
  
  console.log('--- [SERVIDOR] FIN DE DEBUGGING ---');

  return (
    <PageLayout>
      <ProfileContent
        initialOrderedDesignIds={initialOrderedDesignIds}
        initialUserDesigns={initialUserDesigns}
        initialUserPayments={initialUserPayments} // Pasar los pagos como prop
      />
    </PageLayout>
  );
}

export default ProfilePage;
