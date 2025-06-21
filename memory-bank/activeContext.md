### 2025-06-20 - Redirección de Pagos Pendientes

**Descripción:** Se implementó una redirección automática desde la página `/pagos-pendientes` a `/catalogo` cuando el usuario no tiene pagos de envío pendientes. Esto mejora la experiencia del usuario al evitar que vean una página vacía y los guía directamente a la sección de compras.

**Archivos Modificados:**
- `src/app/pagos-pendientes/page.jsx`:
  - Se añadió lógica dentro de `fetchPedidosPendientes` para redirigir a `/catalogo` si `pedidos.length` es 0.
  - Se eliminó el bloque de renderizado condicional que mostraba un mensaje "No tienes pagos de envío pendientes" y un enlace, ya que la redirección lo hace redundante.

**Problemas Resueltos:**
- Se abordó la necesidad de redirigir a los usuarios de manera eficiente cuando no hay pagos pendientes, mejorando la navegación y la usabilidad.

**Próximos Pasos:**
- Ninguno, la tarea ha sido completada.
