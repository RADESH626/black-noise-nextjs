Feature: Gestión del Carrito de Compras
Resumen
El sistema de carrito de compras fue refactorizado para usar un estado global a través de React Context, mejorando la consistencia, el rendimiento y la experiencia de usuario con actualizaciones optimistas.

Estado Global
Contexto: src/context/CartContext.jsx

Proveedor: CartProvider (integrado en src/app/SessionProviderWrapper.jsx)

Consumidores Principales:

HeaderPrincipal.jsx: Muestra el contador de ítems.

CartComponent.jsx: Muestra y gestiona el contenido del carrito.

catalogo/page.jsx: Permite añadir ítems y refleja su estado.

Actualizaciones Optimistas y Debouncing
Todas las interacciones con el carrito (add, remove, update quantity, clear) siguen un patrón de actualización optimista para una respuesta instantánea.

UI Primero: El estado cartItems en CartContext se modifica inmediatamente.

Debounce: Una llamada a la server action correspondiente se retrasa 1000ms. Esto es crucial para el campo de cantidad, evitando una petición por cada dígito tecleado.

Sincronización: La acción del servidor (CartActions.js) devuelve el carrito completo y actualizado, que se utiliza para sincronizar el estado global, asegurando la consistencia.

Rollback: Si la acción falla, el estado se revierte a la versión previa y se registra un error.

Optimización de Rendimiento
React.memo: Se aplica en CartItem.jsx, DesignCard.jsx y DesignGrid.jsx para evitar re-renderizados innecesarios.

Referencias Estables: Las funciones de callback se envuelven en useCallback en CartComponent.jsx.

Archivos Clave
src/context/CartContext.jsx

src/app/acciones/CartActions.js

src/components/common/CartComponent.jsx

src/app/catalogo/page.jsx

src/components/catalogo/DesignGrid.jsx
