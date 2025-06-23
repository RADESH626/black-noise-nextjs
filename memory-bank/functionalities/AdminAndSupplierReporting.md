# Gestión de Reportes y Filtros en Paneles de Administrador y Proveedor

Este documento describe la implementación de filtros de búsqueda y la funcionalidad de exportación a PDF para los paneles de administración y proveedor.

## 1. Generalización del Componente `BotonExportarPDF`

El componente `src/components/common/botones/BotonExportarPDF.jsx` ha sido modificado para ser genérico y reutilizable. Ahora acepta las siguientes props:

-   `data`: Un array de objetos que representan los datos a exportar.
-   `reportTitle`: El título que aparecerá en el reporte PDF.
-   `tableHeaders`: Un array de strings que define los encabezados de la tabla en el PDF.
-   `tableBodyMapper`: Una función que toma un elemento de `data` y devuelve un array de valores para una fila de la tabla.

Esto permite que el mismo componente se utilice para generar reportes de usuarios, pedidos, etc., simplemente pasando los datos y la configuración adecuada.

## 2. Componente Genérico `FilterBar`

Se ha creado un nuevo componente `src/components/common/FilterBar.jsx` para proporcionar una interfaz de usuario de filtrado reutilizable. Este componente incluye campos para:

-   `searchText`: Búsqueda por texto general (nombre, ID, correo, etc.).
-   `startDate`, `endDate`: Filtrado por rango de fechas (basado en `createdAt`).
-   `status`: Un selector de estado (configurable mediante `additionalFilters` prop).

El componente `FilterBar` emite un evento `onFilterChange` con el objeto de filtros actual cuando se aplican o se limpian los filtros.

## 3. Implementación de Filtros en el Panel de Administrador

### 3.1. `src/app/acciones/UsuariosActions.js`

-   La función `FiltrarUsuarios` ha sido modificada para aceptar un objeto de filtros directamente en lugar de `formData`, lo que la hace más flexible.
-   La función `ObtenerTodosLosUsuarios` ahora utiliza `FiltrarUsuarios` internamente, permitiendo que todos los usuarios se obtengan con o sin filtros.
-   Se eliminó la función `obtenerUsuariosHabilitados` ya que la lógica de habilitado se maneja a través de los filtros en `FiltrarUsuarios`.

### 3.2. `src/components/layout/admin/dashboards/users/UsuariosClientPage.jsx`

-   Se ha integrado el `FilterBar` para permitir a los administradores filtrar la lista de usuarios.
-   Se ha integrado el `BotonExportarPDF` para generar reportes PDF de los usuarios filtrados.
-   La función `fetchAndSetUsers` ahora acepta y utiliza el objeto de filtros para obtener datos del servidor.
-   Se han definido `userTableHeaders` y `userTableBodyMapper` para configurar el `BotonExportarPDF` para reportes de usuarios.

### 3.3. `src/app/acciones/PedidoActions.js`

-   La función `obtenerPedidos` ha sido modificada para aceptar un objeto de filtros (searchText, startDate, endDate, estadoPedido, proveedorId).
-   La lógica de filtrado se aplica directamente en la consulta a la base de datos.

### 3.4. `src/components/layout/admin/dashboards/PedidosDashboard.jsx`

-   Se ha integrado el `FilterBar` para permitir a los administradores filtrar la lista de pedidos.
-   Se ha integrado el `BotonExportarPDF` para generar reportes PDF de los pedidos filtrados.
-   La función `fetchAndSetPedidos` ahora acepta y utiliza el objeto de filtros para obtener datos del servidor.
-   Se han definido `pedidoTableHeaders` y `pedidoTableBodyMapper` para configurar el `BotonExportarPDF` para reportes de pedidos.
-   Se han añadido opciones de filtro de estado de pedido dinámicas utilizando `EstadoPedido` del enum.

## 4. Implementación de Filtros en el Panel de Proveedor

### 4.1. `src/app/acciones/ProveedorPedidoActions.js`

-   La función `obtenerPedidosPorProveedorId` ha sido modificada para aceptar un objeto de filtros (pedidoId, proveedorId, searchText, startDate, endDate, estadoPedido).
-   La lógica de filtrado se aplica directamente en la consulta a la base de datos, asegurando que solo se muestren los pedidos del proveedor autenticado.

### 4.2. `src/components/proveedor/pedidos/PedidosClientPage.jsx`

-   Se ha integrado el `FilterBar` para permitir a los proveedores filtrar sus pedidos.
-   Se ha integrado el `BotonExportarPDF` para generar reportes PDF de los pedidos del proveedor filtrados.
-   La obtención de pedidos ahora se realiza de forma reactiva a los cambios en los filtros y al `proveedorId` de la sesión.
-   Se han definido `pedidoTableHeaders` y `pedidoTableBodyMapper` para configurar el `BotonExportarPDF` para reportes de pedidos de proveedor.
-   Se han añadido opciones de filtro de estado de pedido dinámicas utilizando `EstadoPedido` del enum.

## 5. Próximos Pasos

-   Verificar la funcionalidad completa en un entorno de desarrollo.
-   Asegurar que los estilos y la experiencia de usuario de los filtros sean consistentes.
