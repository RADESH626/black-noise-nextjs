import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObtenerUsuarioPorId } from "@/app/acciones/UsuariosActions";
import FormEditarUsuario from "@/components/perfil/FormEditarUsuario";

async function EditarPerfil() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userData = await ObtenerUsuarioPorId(userId);

  if (!userData) {
    // Handle case where user data is not found, maybe redirect or show an error
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Editar Perfil</h1>
          <div className="bg-black rounded-lg p-6 text-white shadow-lg">
            <div className="text-white text-center p-4">
              <h3 className="text-lg mb-4">Error al cargar el perfil.</h3>
              <p>No se pudieron obtener los datos del usuario.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Editar Perfil</h1>
        <div className="bg-black rounded-lg p-6 text-white shadow-lg">
          <FormEditarUsuario userData={userData} userId={userId} onSuccess={() => redirect("/perfil")} />
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;
