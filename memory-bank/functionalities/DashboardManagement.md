# Funcionalidad: Gestión del Dashboard

## Descripción
Esta funcionalidad se refiere a la gestión y visualización de los paneles de control (dashboards) dentro de la aplicación. Esto puede incluir dashboards para administradores, usuarios regulares o proveedores, mostrando información relevante y métricas clave.

## Componentes Involucrados

### Frontend
*   **`src/app/admin/page.jsx`**: El dashboard principal de administración.
*   **`src/app/acciones/DashboardActions.js`**: Acciones de servidor para obtener datos para los dashboards.
*   **`src/components/layout/admin/dashboards/`**: Directorio que contiene componentes específicos de dashboards (ej. `UsuariosDashboard.jsx`).

### Backend (Acciones de Servidor/API)
*   **`src/app/acciones/DashboardActions.js`**: Contiene funciones para obtener datos específicos para diferentes dashboards (ej. `ObtenerDatosDashboardAdmin`, `ObtenerDatosDashboardUsuario`).

## Flujo de Trabajo

1.  Un usuario (administrador, regular, proveedor) accede a su respectivo dashboard.
2.  La página del dashboard utiliza Server Actions de `DashboardActions.js` para obtener los datos necesarios.
3.  Los componentes del frontend renderizan la información en el dashboard (gráficos, tablas, resúmenes).

## Consideraciones Adicionales
*   Diferenciación de dashboards según el rol del usuario.
*   Optimización de la carga de datos para dashboards complejos.
*   Implementación de widgets o módulos personalizables en el dashboard.
