import { redirect } from "next/navigation";
import FormEditarUsuario from "@/app/admin/usuarios/components/FormEditarUsuario";

async function EditarPerfil() {
  const getUserData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/user', {
        cache: 'no-store'
      });
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const { user } = await getUserData() || {};

  if (!user) {
    return redirect("/login");
  }

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
