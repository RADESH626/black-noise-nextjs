# 🧪 Guía de Pruebas - Sistema de Datos Mock

## 🚀 Pasos para Probar la Implementación

### 1. **Preparar el Entorno**

```bash
# 1. Cambiar a la rama con la implementación
git checkout feature/test-data-ui

# 2. Instalar dependencias (si es necesario)
npm install

# 3. Verificar que estás en modo desarrollo
echo $NODE_ENV  # Debe ser 'development' o no estar definido
```

### 2. **Iniciar la Aplicación**

```bash
# Ejecutar el servidor de desarrollo
npm run dev

# La app estará disponible en:
# http://localhost:3000
```

### 3. **Acceder al Dashboard Administrativo**

#### **Opción A: Login como Administrador**
1. Ve a: `http://localhost:3000/login`
2. Usa las credenciales existentes de administrador
3. Una vez logueado, ve a: `http://localhost:3000/admin`

#### **Opción B: Acceso Directo (para pruebas)**
- Ve directamente a: `http://localhost:3000/admin`
- Si no tienes autenticación configurada, el componente se renderizará

### 4. **Verificar que el Sistema Mock Esté Activo**

En el dashboard admin, deberías ver:

✅ **Indicador Visual**: Banner morado con "🎭 Datos de Prueba Activos"
✅ **Pestañas Interactivas**: Usuarios, Diseños, Proveedores, etc.
✅ **Datos Realistas**: Tablas y tarjetas con información colombiana
✅ **Estadísticas en Tiempo Real**: Contadores y métricas

### 5. **Explorar las Funcionalidades**

#### **Dashboard Principal**
- **Tarjetas de estadísticas** con números reales
- **Sección de datos mock** con interface de pestañas
- **Acciones rápidas** y navegación mejorada

#### **Pestaña "Usuarios"**
- Tabla con 8 usuarios (clientes, proveedores, admins)
- Información personal con contexto colombiano
- Estados activos/inactivos para testing

#### **Pestaña "Diseños"**
- Galería de 10 diseños con imágenes reales
- Precios en pesos colombianos
- Sistema de likes y categorías

#### **Pestaña "Proveedores"**
- 3 empresas con información completa
- Calificaciones y capacidades de producción
- Métricas empresariales realistas

#### **Pestaña "Dashboard"**
- Resumen general de todas las entidades
- Diseños populares con imágenes
- Pedidos recientes con estados

### 6. **Verificar Funcionalidades Específicas**

#### **Control Manual del Modo Mock**
```javascript
// Abrir consola del navegador (F12) y ejecutar:
console.log(window.location.href);
// Buscar el botón "Desactivar" en el banner morado
// Debería mostrar/ocultar los datos dinámicamente
```

#### **Datos en Consola**
```javascript
// En la consola del navegador:
// Deberías ver: "🎭 Mock Mode activado - Usando datos de prueba"
```

#### **Verificar Imágenes**
- Las imágenes deberían cargar desde `/img/Camisetas/`, `/img/Hoddie_s/`, etc.
- Si no se ven las imágenes, es normal - las rutas apuntan a assets existentes

### 7. **Probar en Diferentes Escenarios**

#### **Modo Desarrollo (Automático)**
- El sistema debería activarse automáticamente
- Mensaje en consola confirmando activación

#### **Forzar Activación (Variable de Entorno)**
```bash
# Agregar al archivo .env.local:
NEXT_PUBLIC_MOCK_MODE=true

# Reiniciar el servidor:
npm run dev
```

#### **Modo Producción (Desactivado)**
```bash
# Simular producción:
NODE_ENV=production npm run dev
# Los datos mock NO deberían aparecer
```

### 8. **Verificar Integración en Otras Páginas**

#### **Ejemplo: Agregar Mock a Página de Usuarios**
1. Ve a: `src/app/admin/usuarios/page.jsx`
2. Agrega el import:
```jsx
import MockDataDemo from '@/components/demo/MockDataDemo';
```
3. Incluye el componente en el JSX:
```jsx
<MockDataDemo />
```
4. Reinicia y verifica en: `http://localhost:3000/admin/usuarios`

### 9. **Usar el Hook en Componentes Personalizados**

#### **Ejemplo Rápido:**
Crea un archivo de prueba `src/components/TestMockData.jsx`:

```jsx
"use client";
import { useMockData } from '@/hooks/useMockData';

export default function TestMockData() {
  const mockData = useMockData();
  
  if (!mockData.isMockMode()) {
    return <div>Mock mode desactivado</div>;
  }
  
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3>Test de Datos Mock</h3>
      <p>Total usuarios: {mockData.usuarios.count()}</p>
      <p>Total diseños: {mockData.designs.count()}</p>
      <p>Diseños populares: {mockData.designs.getPopulares(3).length}</p>
      
      <div className="mt-4">
        <h4>Usuarios por rol:</h4>
        <ul>
          <li>Clientes: {mockData.usuarios.getByRol('CLIENTE').length}</li>
          <li>Proveedores: {mockData.usuarios.getByRol('PROVEEDOR').length}</li>
          <li>Admins: {mockData.usuarios.getByRol('ADMINISTRADOR').length}</li>
        </ul>
      </div>
    </div>
  );
}
```

Luego úsalo en cualquier página para verificar que funciona.

### 10. **Solución de Problemas Comunes**

#### **No veo los datos mock:**
- ✅ Verifica que estás en `NODE_ENV=development`
- ✅ Revisa la consola por mensajes de error
- ✅ Asegúrate de estar en la rama `feature/test-data-ui`

#### **Las imágenes no cargan:**
- ✅ Normal - las rutas apuntan a assets que pueden no existir
- ✅ Los datos mock funcionan independientemente de las imágenes

#### **Error en el hook:**
- ✅ Verifica que el import sea correcto: `@/hooks/useMockData`
- ✅ Asegúrate de usar el hook en un componente cliente (`"use client"`)

#### **No aparece el banner morado:**
- ✅ Ve directamente a `/admin` donde está implementado
- ✅ Verifica que el componente MockDataDemo esté importado

### 11. **Validar Datos Específicos**

#### **En la consola del navegador:**
```javascript
// Acceder a todos los datos:
// (En la página donde uses useMockData)
console.log('Datos disponibles:', window.__mockData || 'Hook no encontrado');
```

#### **Verificar relaciones:**
- Los pedidos deben tener `clienteId` y `proveedorId` válidos
- Las ventas deben corresponder a pedidos existentes
- Los pagos deben estar vinculados a ventas

### 12. **Métricas de Éxito**

✅ **Banner de datos mock visible**
✅ **Pestañas funcionando correctamente**
✅ **Datos realistas en tablas y tarjetas**
✅ **Contadores mostrando números correctos**
✅ **Hook funcionando en consola**
✅ **Modo toggle funcionando**

---

## 🎯 Resultado Esperado

Deberías ver una interfaz completamente poblada con datos realistas que permite:
- **Explorar visualmente** cómo se ven las interfaces con datos reales
- **Probar diferentes estados** y escenarios
- **Desarrollar nuevas características** con datos inmediatos
- **Validar diseños** con contenido realista

¡Si ves todo esto funcionando, la implementación del sistema de datos mock es un éxito total! 🎉
