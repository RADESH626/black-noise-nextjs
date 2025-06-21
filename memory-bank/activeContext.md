### 2025-06-20 - Redirección de Pagos Pendientes y Corrección de Pop-up

**Descripción:**
1.  Se implementó una redirección automática desde la página `/pagos-pendientes` a `/catalogo` cuando el usuario no tiene pagos de envío pendientes.
2.  Se corrigió la aparición de una "x" inesperada en el pop-up de "Procesando pago..." y se aseguró que este mensaje sea persistente y no tenga un botón de cierre.

**Archivos Modificados:**
- `src/app/pagos-pendientes/page.jsx`:
  - Se añadió lógica dentro de `fetchPedidosPendientes` para redirigir a `/catalogo` si `pedidos.length` es 0.
  - Se eliminó el bloque de renderizado condicional que mostraba un mensaje "No tienes pagos de envío pendientes" y un enlace.
  - Se modificó la llamada a `showPopUp` en `handlePaymentSubmit` para que el mensaje "Procesando pago..." sea persistente (`persistent: true`).
- `src/components/common/modales/PopUpMessage.jsx`:
  - Se ajustó la lógica para que el icono de tipo ('✓' o '✕') solo se muestre si el `type` es `success` o `error`.
  - Se ocultó el botón de cierre (`✕`) cuando el pop-up es `persistent`.

**Problemas Resueltos:**
- Se abordó la necesidad de redirigir a los usuarios de manera eficiente cuando no hay pagos pendientes, mejorando la navegación y la usabilidad.
- Se eliminó la "x" visualmente incorrecta en el pop-up de carga y se aseguró que los mensajes de carga no se cierren automáticamente ni tengan un botón de cierre.

**Próximos Pasos:**
- Ninguno, la tarea ha sido completada.
