# Plan de Refactorización y Desarrollo de Black Noise

Este plan guiará la refactorización y el desarrollo para cumplir con los requisitos formales. Cada tarea debe ser completada en orden.

## Fase 1: Autenticación y Perfil Básico

- [x] **Tarea 1.1:** Instalar y configurar todas las dependencias necesarias: `zod`, `react-hook-form`, `react-pdf`, `papaparse`, `resend`.
- [ ] **Tarea 1.2:** Implementar la lógica de registro de usuario, incluyendo el formulario con validaciones (React Hook Form + Zod) y la API route que guarda el usuario en la base de datos (hasheando la contraseña).
- [ ] **Tarea 1.3:** Implementar la lógica de inicio de sesión utilizando NextAuth.js.
- [ ] **Tarea 1.4:** Crear la página de perfil de usuario (`/my-profile`) donde el usuario pueda ver y editar su información básica.

## Fase 2: Flujo de Cliente (Carrito y Pedido)

- [ ] **Tarea 2.1:** Crear la UI para la galería de diseños y la lógica para añadir un diseño al modelo `Carrito` del usuario.
- [ ] **Tarea 2.2:** Crear la página de carrito (`/cart`) que muestra los diseños seleccionados.
- [ ] **Tarea 2.3:** Implementar la lógica para convertir el contenido del carrito en un `Pedido` permanente en la base de datos y limpiar el carrito.

## Fase 3: El Corazón del Admin (CRUD y Reportes)

- [ ] **Tarea 3.1:** Implementar el CRUD para `Usuarios` y `Proveedores`, asegurando validaciones con Zod en el backend.
- [ ] **Tarea 3.2:** Implementar la funcionalidad de carga masiva de usuarios desde un archivo CSV.
- [ ] **Tarea 3.3:** Crear el componente de UI para filtros multicriterio en el panel de usuarios.
- [ ] **Tarea 3.4:** Crear la API route y la lógica para generar y descargar un reporte de usuarios en formato PDF basado en los filtros.

## Fase 4: Flujo del Proveedor y Comunicaciones

- [ ] **Tarea 4.1:** Crear la vista para que el rol `PROVEEDOR` pueda ver y actualizar el estado de sus pedidos asignados.
- [ ] **Tarea 4.2:** Crear la interfaz de administración y la API route para el envío de correos masivos.
