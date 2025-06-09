# Active Context - 2025-09-06

## Task: Redirigir a proveedores a la lista de pedidos al iniciar sesión

### Descripción:
Se ha modificado el flujo de autenticación para que, al iniciar sesión como proveedor, el usuario sea redirigido directamente a la página de lista de pedidos (`/proveedor/pedidos`) en lugar de la página principal del portal de proveedores (`/proveedor`).

### Archivos Modificados:

#### 📄 **Archivo:** `src/components/layout/general/forms/FormLogin.jsx`
*   **Cambio:** Se actualizó la lógica de redirección dentro del `useEffect` para el rol `PROVEEDOR`.
*   **Detalle:** La línea `router.push('/proveedor');` fue cambiada a `router.push('/proveedor/pedidos');` para asegurar la redirección directa a la lista de pedidos.

### Próximos Pasos:
1.  Generar y presentar el comando `git add`.
2.  Esperar confirmación del usuario.
3.  Generar y presentar el comando `git commit`.
