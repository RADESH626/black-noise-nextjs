# Funcionalidad de Filtros para Paneles de Administración

Esta funcionalidad introduce filtros específicos para cada modelo principal de la aplicación en sus respectivos paneles de administración, mejorando la capacidad de búsqueda y gestión de datos.

## Modelos y Filtros Específicos

### Modelo: Design
- **Fecha de Creación:** Rango de fechas para filtrar diseños por su fecha de creación.
- **Categoría de Producto:** Selección de categorías predefinidas.
- **Estado del Diseño:** Estado actual del diseño (ej. "Pendiente", "Aprobado", "Rechazado").
- **Diseñador/Usuario:** Filtrar por el usuario que creó el diseño.
- **Rango de Precio:** Rango numérico para el precio del diseño.
- **Tallas Disponibles:** Selección de tallas disponibles para el diseño.

### Modelo: Pedido
- **Estado del Pedido:** Estado actual del pedido (ej. "Pendiente", "Completado", "Enviado", "Cancelado").
- **Estado del Pago:** Estado del pago asociado al pedido (ej. "Pagado", "Pendiente", "Reembolsado").
- **Método de Entrega:** Tipo de método de entrega (ej. "Envío a domicilio", "Recogida en tienda").
- **Proveedor Asignado:** Filtrar por el proveedor asignado al pedido.
- **Usuario Comprador:** Filtrar por el usuario que realizó el pedido.
- **Rango de Valor Total:** Rango numérico para el valor total del pedido.
- **Fecha del Pedido:** Rango de fechas para filtrar pedidos por su fecha.
- **Pedido Cancelado:** Booleano para indicar si el pedido fue cancelado.
- **Pedido Refabricado:** Booleano para indicar si el pedido fue refabricado.

### Modelo: Pago
- **Método de Pago:** Tipo de método de pago (ej. "Tarjeta de Crédito", "PayPal", "Transferencia Bancaria").
- **Estado de Transacción:** Estado de la transacción de pago (ej. "Éxito", "Fallido", "Pendiente").
- **Usuario que Realizó el Pago:** Filtrar por el usuario que realizó el pago.
- **Pedido Asociado:** Filtrar por el pedido al que está asociado el pago.
- **Venta Asociada:** Filtrar por la venta a la que está asociado el pago.
- **Rango de Valor del Pago:** Rango numérico para el valor del pago.
- **Fecha del Pago:** Rango de fechas para filtrar pagos por su fecha.

### Modelo: Proveedor
- **Disponibilidad:** Estado de disponibilidad del proveedor (ej. "Activo", "Inactivo").
- **Especialidad:** Tipo de especialidad del proveedor.
- **Métodos de Pago Aceptados:** Métodos de pago que acepta el proveedor.
- **Habilitado:** Booleano para indicar si el proveedor está habilitado.
- **Rango de Órdenes Activas:** Rango numérico para el número de órdenes activas del proveedor.
- **Fecha de Última Asignación:** Rango de fechas para la última asignación de un pedido al proveedor.

### Modelo: Usuario
- **Rol:** Rol del usuario (ej. "Administrador", "Cliente", "Diseñador", "Proveedor").
- **Tipo de Documento:** Tipo de documento de identificación del usuario.
- **Género:** Género del usuario.
- **Habilitado:** Booleano para indicar si el usuario está habilitado.
- **Fecha de Nacimiento:** Rango de fechas para la fecha de nacimiento del usuario.
- **Fecha de Registro:** Rango de fechas para la fecha de registro del usuario.

### Modelo: Venta
- **Estado de Venta:** Estado actual de la venta (ej. "Completada", "Pendiente", "Cancelada").
- **Pedido Asociado:** Filtrar por el pedido asociado a la venta.
- **Rango de Valor de Venta:** Rango numérico para el valor total de la venta.
- **Fecha de Venta:** Rango de fechas para filtrar ventas por su fecha.

## Arquitectura Propuesta

1.  **Backend (Server Actions):**
    *   Modificar las Server Actions existentes (o crear nuevas) para cada modelo (`DesignActions.js`, `PedidoActions.js`, etc.) para que acepten un objeto de filtros como parámetro.
    *   Estas acciones construirán dinámicamente las consultas de Mongoose basándose en los filtros proporcionados.

2.  **Frontend (React Query y Componentes de Filtro):**
    *   Crear componentes de UI específicos para los filtros de cada modelo (ej. `DesignFilters.jsx`, `UserFilters.jsx`). Estos componentes gestionarán el estado local de los filtros y expondrán un objeto de filtros para ser utilizado por la página principal.
    *   Las páginas de administración de cada modelo (`src/app/admin/designs/page.jsx`, `src/app/admin/users/page.jsx`, etc.) utilizarán React Query para llamar a las Server Actions, pasando el objeto de filtros.
    *   React Query gestionará el caching y el refetching de los datos cuando los filtros cambien.

## Pasos de Implementación

1.  **Documentación:** (Completado) Creación de este documento.
2.  **Identificación de Paneles de Administración:** Localizar los archivos de las páginas de administración para cada modelo.
3.  **Modificación de Acciones de Servidor:** Ajustar las Server Actions para aceptar y aplicar filtros.
4.  **Creación de Componentes de Filtro en el Frontend:** Desarrollar los componentes de UI para los filtros.
5.  **Integración de Filtros en los Paneles de Administración:** Conectar los componentes de filtro con las páginas de administración y las llamadas a React Query.
6.  **Actualización de `activeContext.md` y `progress.md`.**
