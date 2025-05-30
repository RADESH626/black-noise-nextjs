import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { obtenerDesignsPorUsuarioId } from "@/app/acciones/DesignActions";
import ProfileContent from "./ProfileContent";
import { mockDesigns } from "@/data/mock/designs"; // Import mock designs

async function ProfileData() {
  
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/login");
  }

  const user = session.user;

  // Obtener los diseños del usuario (o usar mock data para prueba)
  let userDesigns = [];
  let error = null;

  // For testing purposes, we will use the mock designs directly
  // In a real scenario, you would conditionally fetch from DB or mock
  const testDesigns = mockDesigns.filter(design => 
    design._id === "mock-design-test-1" || design._id === "mock-design-test-2"
  );
  
  // Assign the test designs to userDesigns for display
  userDesigns = testDesigns;

  // Original logic (commented out for temporary mock display)
  // const { designs: fetchedDesigns, error: fetchError } = await obtenerDesignsPorUsuarioId(user.id);
  // userDesigns = fetchedDesigns || [];
  // error = fetchError;

  return (
    <ProfileContent 
      user={user}
      designs={userDesigns}
      error={error}
    />
  );
}

export default ProfileData;
