# Generación de Reportes para Administradores y Proveedores

Este documento describe la funcionalidad de generación de reportes en formato CSV para los dashboards de administración y proveedores.

## Dashboards con Generación de Reportes

La funcionalidad de exportación a CSV ha sido implementada en los siguientes dashboards:

*   **Diseños (Admin)**: Permite a los administradores exportar un reporte de todos los diseños, aplicando los filtros actuales.
    *   **Archivos Modificados**:
        *   `src/app/acciones/DesignActions.js`: Se añadió la función `exportarDesignsCSV` para obtener y formatear los datos de diseños a CSV.
        *   `src/components/admin/designs/DesignsClientPage.jsx`: Se añadió un botón "Generar Reporte CSV" y la lógica para llamar a la acción de servidor y descargar el archivo.

*   **Proveedores (Admin)**: Permite a los administradores exportar un reporte de todos los proveedores, aplicando los filtros actuales.
    *   **Archivos Modificados**:
        *   `src/app/acciones/ProveedorActions.js`: Se añadió la función `exportarProveedoresCSV` para obtener y formatear los datos de proveedores a CSV.
        *   `src/components/admin/proveedores/ProveedoresClientPage.jsx`: Se añadió un botón "Generar Reporte CSV" y la lógica para llamar a la acción de servidor y descargar el archivo.

*   **Ventas (Admin)**: Permite a los administradores exportar un reporte de todas las ventas, aplicando los filtros actuales.
    *   **Archivos Modificados**:
        *   `src/app/acciones/VentaActions.js`: Se añadió la función `exportarVentasCSV` para obtener y formatear los datos de ventas a CSV.
        *   `src/components/layout/admin/dashboards/VentasDashboard.jsx`: Se añadió un botón "Generar Reporte CSV" y la lógica para llamar a la acción de servidor y descargar el archivo.

*   **Pagos (Admin)**: Permite a los administradores exportar un reporte de todos los pagos, aplicando los filtros actuales.
    *   **Archivos Modificados**:
        *   `src/app/acciones/PagoActions.js`: Se añadió la función `exportarPagosCSV` para obtener y formatear los datos de pagos a CSV.
        *   `src/components/layout/admin/dashboards/PagosDashboard.jsx`: Se añadió un botón "Generar Reporte CSV" y la lógica para llamar a la acción de servidor y descargar el archivo.

## Formato del Reporte CSV

Cada reporte CSV incluye las columnas relevantes para la entidad correspondiente (diseños, proveedores, ventas, pagos), con datos formateados para una fácil lectura.

## Uso

Para generar un reporte, el usuario debe navegar al dashboard correspondiente en la sección de administración y hacer clic en el botón "Generar Reporte CSV". El archivo se descargará automáticamente en el navegador.
