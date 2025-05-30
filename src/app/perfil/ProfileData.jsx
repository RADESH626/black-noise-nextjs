import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { obtenerDesignsPorUsuarioId } from "@/app/acciones/DesignActions";
import ProfileContent from "./ProfileContent";

async function ProfileData() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/login");
  }

  const user = session.user;

  // Obtener los diseños del usuario
  const { designs, error } = await obtenerDesignsPorUsuarioId(user.id);
  const userDesigns = designs || [];

  return (
    <ProfileContent 
      user={user}
      designs={userDesigns}
      error={error}
    />
  );
}

export default ProfileData;
