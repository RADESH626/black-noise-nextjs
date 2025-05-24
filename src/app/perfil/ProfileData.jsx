import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { obtenerDesignsPorUsuarioId } from "@/app/acciones/DesignActions";
import ProfileContent from "./ProfileContent";

async function ProfileData() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session) {
    return redirect("/");
  }

  // Obtener los diseños del usuario directamente
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
