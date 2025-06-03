# Sistema de Datos Mock para Black Noise E-commerce

## 📖 Descripción

Este sistema proporciona datos de prueba realistas para el desarrollo y visualización de la aplicación Black Noise E-commerce. Los datos mock están organizados por entidades y incluyen relaciones entre ellos para simular un entorno de producción.

## 🗂️ Estructura de Archivos

```
src/data/mock/
├── index.js              # Exportaciones principales
├── usuarios.js           # Datos de usuarios (clientes, proveedores, admins)
├── designs.js            # Catálogo de diseños de ropa
├── proveedores.js        # Información de empresas proveedoras
├── pedidos.js            # Pedidos de clientes
├── ventas.js             # Transacciones de venta
├── pagos.js              # Información de pagos y transacciones
└── README.md             # Esta documentación
```

## 🚀 Uso Rápido

### 1. Hook useMockData

```jsx
import { useMockData } from '@/hooks/useMockData';

function MiComponente() {
  const mockData = useMockData();

  // Verificar si el modo mock está activo
  if (!mockData.isMockMode()) {
    return <div>Datos mock desactivados</div>;
  }

  // Obtener datos
  const usuarios = mockData.usuarios.getAll();
  const designs = mockData.designs.getPopulares(5);
  const estadisticas = mockData.dashboard.getResumenGeneral();

  return (
    <div>
      <h2>Usuarios: {mockData.usuarios.count()}</h2>
      <h2>Diseños populares: {designs.length}</h2>
    </div>
  );
}
```

### 2. Importación Directa

```jsx
import { mockUsuarios, getMockUsuariosByRol } from '@/data/mock/usuarios';
import { mockDesigns, getMockDesignsPopulares } from '@/data/mock/designs';

// Usar directamente los datos
const clientes = getMockUsuariosByRol('CLIENTE');
const designsPopulares = getMockDesignsPopulares(3);
```

## 📊 Entidades Disponibles

### Usuarios (8 registros)
- **Tipos**: Clientes, Proveedores, Administradores
- **Campos**: Información personal, contacto, rol, estado
- **Funciones**:
  - `getAll()` - Todos los usuarios
  - `getByRol(rol)` - Filtrar por rol
  - `getHabilitados()` - Solo usuarios activos
  - `getById(id)` - Usuario específico

### Diseños (10 registros)
- **Categorías**: Camisa, Pantalón, Chaqueta
- **Campos**: Nombre, imagen, precio, likes, palabras clave
- **Funciones**:
  - `getAll()` - Todos los diseños
  - `getPopulares(limit)` - Más populares por likes
  - `getByCategoria(categoria)` - Filtrar por categoría
  - `search(query)` - Búsqueda por texto

### Proveedores (3 registros)
- **Campos**: Empresa, capacidad, calificación, experiencia
- **Funciones**:
  - `getAll()` - Todos los proveedores
  - `getMejorCalificados()` - Por calificación
  - `getEstadisticas()` - Estadísticas generales
  - `getByCategoria(categoria)` - Por especialidad

### Pedidos (6 registros)
- **Estados**: Pendiente, En Producción, Completado, Entregado, Cancelado
- **Funciones**:
  - `getByEstado(estado)` - Filtrar por estado
  - `getRecientes(limit)` - Más recientes
  - `getEstadisticas()` - Métricas de pedidos

### Ventas (6 registros)
- **Estados**: Pendiente, Procesando, Completada, Cancelada
- **Funciones**:
  - `getEstadisticas()` - Métricas de ventas
  - `getIngresosMensuales()` - Ingresos por mes
  - `getByMetodoPago(metodo)` - Por forma de pago

### Pagos (7 registros)
- **Métodos**: Tarjeta crédito/débito, PSE, Nequi, DaviPlata
- **Funciones**:
  - `getEstadisticas()` - Métricas de pagos
  - `getReporteComisiones()` - Comisiones por método
  - `getFallidos()` - Pagos fallidos

## 🎛️ Control del Modo Mock

### Activación Automática
- **Desarrollo**: Se activa automáticamente en `NODE_ENV === 'development'`
- **Variable de entorno**: `NEXT_PUBLIC_MOCK_MODE=true` para forzar activación

### Control Manual
```jsx
const mockData = useMockData();

// Verificar estado
if (mockData.isMockMode()) {
  console.log('Modo mock activo');
}

// Alternar manualmente
mockData.toggleMockMode();
```

## 🖼️ Componente de Demostración

El sistema incluye un componente completo de demostración:

```jsx
import MockDataDemo from '@/components/demo/MockDataDemo';

function MiPagina() {
  return (
    <div>
      <h1>Mi Dashboard</h1>
      <MockDataDemo />
    </div>
  );
}
```

## 📈 Dashboard Integrado

Para dashboard con métricas completas:

```jsx
const resumen = mockData.dashboard.getResumenGeneral();

// Incluye:
// - Conteos totales de todas las entidades
// - Estadísticas de ventas, pedidos y pagos
// - Diseños populares
// - Pedidos y ventas recientes
```

## 🔧 Personalización

### Agregar Nuevos Datos

1. **Modificar archivo correspondiente** (ej: `usuarios.js`)
2. **Seguir la estructura existente**
3. **Actualizar funciones de filtrado si es necesario**

### Crear Nueva Entidad

1. **Crear archivo** `nueva-entidad.js`
2. **Exportar desde** `index.js`
3. **Agregar al hook** `useMockData.js`
4. **Actualizar dashboard** si es relevante

## 🎨 Mejores Prácticas

### 1. Usar el Hook
```jsx
// ✅ Recomendado
const mockData = useMockData();
const usuarios = mockData.usuarios.getAll();

// ❌ Evitar
import { mockUsuarios } from '@/data/mock/usuarios';
```

### 2. Verificar Modo Mock
```jsx
// ✅ Siempre verificar
if (mockData.isMockMode()) {
  // Usar datos mock
} else {
  // Usar datos reales de API
}
```

### 3. Fallbacks Apropiados
```jsx
// ✅ Con fallback
const usuarios = mockData.usuarios.getAll() || [];
const count = mockData.usuarios.count() || 0;
```

## 🔄 Integración con Datos Reales

Para transicionar de mock a datos reales:

```jsx
const { usuarios } = useMockData();

// En producción, reemplazar con:
// const usuarios = await fetchUsuarios();

const usuariosData = usuarios.getAll();
```

## 📝 Ejemplos de Uso

### Lista de Usuarios
```jsx
function TablaUsuarios() {
  const { usuarios } = useMockData();
  
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.getAll().map(usuario => (
          <tr key={usuario._id}>
            <td>{usuario.primerNombre} {usuario.primerApellido}</td>
            <td>{usuario.correo}</td>
            <td>{usuario.rol}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Galería de Diseños
```jsx
function GaleriaDesigns() {
  const { designs } = useMockData();
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {designs.getPopulares(6).map(design => (
        <div key={design._id} className="border rounded-lg p-4">
          <img src={design.imagenDesing} alt={design.nombreDesing} />
          <h3>{design.nombreDesing}</h3>
          <p>${design.valorDesing.toLocaleString()}</p>
          <p>❤️ {design.likes}</p>
        </div>
      ))}
    </div>
  );
}
```

### Dashboard de Estadísticas
```jsx
function DashboardStats() {
  const { dashboard } = useMockData();
  const resumen = dashboard.getResumenGeneral();
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-blue-100 p-4 rounded">
        <h3>Usuarios</h3>
        <p className="text-2xl">{resumen.totalUsuarios}</p>
      </div>
      <div className="bg-purple-100 p-4 rounded">
        <h3>Diseños</h3>
        <p className="text-2xl">{resumen.totalDesigns}</p>
      </div>
      <div className="bg-green-100 p-4 rounded">
        <h3>Ventas</h3>
        <p className="text-2xl">{resumen.totalVentas}</p>
      </div>
      <div className="bg-orange-100 p-4 rounded">
        <h3>Pedidos</h3>
        <p className="text-2xl">{resumen.totalPedidos}</p>
      </div>
    </div>
  );
}
```

---

## 🚀 Implementación Rápida

Para empezar inmediatamente:

1. **Importa el hook** en tu componente
2. **Verifica el modo mock** está activo
3. **Usa las funciones** según tus necesidades
4. **Aplica estilos** para visualizar los datos

¡El sistema está listo para mejorar tu experiencia de desarrollo! 🎨✨
