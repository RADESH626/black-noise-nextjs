import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import FormEditarUsuario from "@/app/admin/usuarios/components/FormEditarUsuario";

async function EditarPerfil() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Editar Perfil</h1>
        <div className="bg-black rounded-lg p-6 text-white shadow-lg">
          <FormEditarUsuario usuarioId={user.id} isProfile={true} />
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;
