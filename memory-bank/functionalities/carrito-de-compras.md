# ✅ Funcionalidad: Carrito de Compras

**Descripción:** Permite a los usuarios añadir productos (diseños) a un carrito de compras, visualizar los ítems seleccionados, gestionar cantidades y proceder al pago.

**Flujo de Interacción:** Los usuarios añaden diseños al carrito desde el catálogo o la página de perfil. Navegan a `/carrito` para ver el resumen, donde pueden ver los ítems, el total y proceder al pago, lo que los redirige a la página de pago.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/app/carrito/page.jsx`
* **Rol:** Página de visualización y gestión del carrito de compras.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `Carrito` (componente principal), `useCartStorage`, `PageLayout`, `HeaderPrincipal`, `Footer`.
    * **Lógica Principal:**
        *   Obtiene los ítems del carrito, el total y funciones para limpiar el carrito de `useCartStorage`.
        *   Muestra los productos en el carrito con detalles como nombre, precio y categoría.
        *   Calcula el total del pedido incluyendo un costo de envío fijo.
        *   El botón "PAGAR AHORA" redirige al usuario a la ruta `/pago`.
        *   Incluye un estado `paymentSuccess` para mostrar un mensaje de éxito después de un pago (aunque la lógica de pago real no está aquí).
    * **Modelos de Datos / Endpoints:** Interactúa con `useCartStorage` para la gestión del estado del carrito en el cliente.

#### 📄 **Archivo:** `src/hooks/useCartStorage.js`
* **Rol:** Custom Hook para la gestión del estado del carrito de compras, incluyendo persistencia en `localStorage`.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `useCartStorage` (hook), `useState`, `useEffect`.
    * **Lógica Principal:**
        *   Inicializa el estado del carrito leyendo desde `localStorage`.
        *   Persiste los cambios del carrito en `localStorage` cada vez que `cartItems` se actualiza.
        *   Proporciona funciones `addItem` (añadir un ítem, incrementando cantidad si ya existe), `removeItem` (eliminar un ítem), `updateQuantity` (actualizar la cantidad de un ítem), `getTotal` (calcular el total del carrito) y `clearCart` (vaciar el carrito).
    * **Modelos de Datos / Endpoints:** No interactúa con la base de datos, gestiona el estado del carrito en el cliente.

#### 📄 **Archivo:** `src/app/perfil/CartComponent.jsx`
* **Rol:** Componente que muestra el contenido del carrito de compras del usuario dentro de la sección de perfil.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `CartComponent` (componente), `useCart` (de `src/context/CartContext`).
    * **Lógica Principal:** Muestra los ítems del carrito obtenidos del contexto `useCart`. (Nota: La importación `useCart` de `src/context/CartContext` en `ProfileContent.jsx` y la ausencia de `src/context/CartContext.jsx` sugieren una posible inconsistencia o que `useCart` es un alias para `useCartStorage`).
    * **Modelos de Datos / Endpoints:** No interactúa directamente con la DB, depende del estado del carrito gestionado en el cliente.

