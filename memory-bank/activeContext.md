# Active Context - 2025-09-06

## Current Work
Assisted in the user profile editing section.

## Key Technical Concepts
- Next.js Server Actions for data fetching and mutations.
- `useActionState` and `useFormStatus` hooks for form management.
- `getServerSession` for server-side session management.
- Component-based architecture for forms and UI.
- Adherence to established `systemPatterns.md` for form structure and field naming.

## Relevant Files and Code
- **`src/components/perfil/FormEditarUsuario.jsx` (Created)**
  - **Summary:** New React component for editing user profile data. It's a client component that uses `useActionState` to interact with the `updateUserAction` server action. It includes all necessary input fields based on the `systemPatterns.md` user form field mapping.
  - **Important Code Snippet:**
    ```jsx
    "use client";
    import { useEffect, useState } from "react";
    import { useActionState, useFormStatus } from "react-dom";
    import { usePopUp } from "@/context/PopUpContext";
    import BotonGeneral from "@/components/common/BotonGeneral";
    import { updateUserAction } from "@/app/acciones/UsuariosActions";

    function SubmitButton({ customText = "Guardar Cambios" }) {
      const { pending } = useFormStatus();
      return (
        <BotonGeneral type="submit" disabled={pending}>
          {pending ? "Guardando..." : customText}
        </BotonGeneral>
      );
    }

    const initialState = { message: null, success: false };

    function FormEditarUsuario({ userData, userId, onSuccess }) {
      const { showPopUp } = usePopUp();
      const [state, formAction] = useActionState(updateUserAction.bind(null, userId), initialState);
      const [formData, setFormData] = useState({
        tipoDocumento: userData?.tipoDocumento || "",
        numeroDocumento: userData?.numeroDocumento || "",
        primerNombre: userData?.primerNombre || "",
        segundoNombre: userData?.segundoNombre || "",
        primerApellido: userData?.primerApellido || "",
        segundoApellido: userData?.segundoApellido || "",
        fechaNacimiento: userData?.fechaNacimiento || "",
        genero: userData?.genero || "",
        numeroTelefono: userData?.numeroTelefono || "",
        direccion: userData?.direccion || "",
        correo: userData?.correo || "",
        rol: userData?.rol || "",
      });

      useEffect(() => {
        if (state.message) {
          showPopUp(state.message, state.success ? "success" : "error");
          if (state.success && onSuccess) {
            onSuccess();
          }
        }
      }, [state, showPopUp, onSuccess]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };

      return (
        <form action={formAction} className="space-y-5 text-white">
          {/* Form fields based on userData and handleChange */}
          <SubmitButton />
        </form>
      );
    }

    export default FormEditarUsuario;
    ```

- **`src/app/perfil/editar/page.jsx` (Modified)**
  - **Summary:** Refactored to fetch user data using `getServerSession` and `ObtenerUsuarioPorId` (Server Action) and then render the `FormEditarUsuario` component. Removed the old `fetch` call and placeholder message.
  - **Important Code Snippet:**
    ```jsx
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
    ```

- **`src/app/acciones/UsuariosActions.js` (Reviewed)**
  - **Summary:** Confirmed the existence and correct implementation of `ObtenerUsuarioPorId` and `updateUserAction`, which are crucial for the profile editing functionality. No direct modifications were made to this file in this session, but its functions were leveraged.

## Problem Solving
- **Discrepancy in Documentation:** Identified that `gestin-de-perfil-de-usuario.md` had outdated information regarding the location and existence of `ProfileContent.jsx` and `FormEditarUsuario.jsx`.
- **Missing Component:** `FormEditarUsuario.jsx` was missing, which was a blocker for the profile editing functionality. This was resolved by creating the component.
- **Outdated Data Fetching:** The `src/app/perfil/editar/page.jsx` was using an old `fetch` API call to a potentially incorrect port (`3001`). This was refactored to use a Server Action (`ObtenerUsuarioPorId`) for consistency and efficiency, aligning with `systemPatterns.md`.

## Pending Tasks and Next Steps
- The core profile editing functionality is now implemented.
- The next step is to present the `git add` command to the user.
