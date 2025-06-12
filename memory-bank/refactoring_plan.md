# Refactoring Plan - Fase 3: Análisis y Sugerencias de Mejora

Este documento detalla las oportunidades de mejora identificadas y las soluciones propuestas para la refactorización de componentes y vistas en el proyecto Next.js, enfocándose en la reutilización, componentización atómica, separación de lógica y presentación, y optimización de layouts.

## 1. Componentes Comunes (`src/components/common/`)

### 1.1. Componentes Atómicos Básicos (Botones, Inputs, Dropdowns, Iconos, Textos)
- **Problema**: Potencial acoplamiento de estilos o comportamientos específicos, limitando la reutilización. Posible duplicación de código para variantes.
- **Solución**:
    - **Componentización Atómica**: Asegurar que cada componente sea puramente presentacional, recibiendo todas las propiedades (estilos, eventos, contenido) a través de `props`.
    - **Separación de Lógica y Presentación**: La lógica de manejo de estado o de negocio debe residir en componentes de nivel superior o en hooks personalizados.
    - **Reutilización**: Consolidar variantes (ej. `BotonPrimario.jsx`, `BotonSecundario.jsx`) en un único `Boton.jsx` con una prop `variant` para configurar su apariencia.

### 1.2. Modales y Pop-ups (`modales/`, `pop-up/`)
- **Problema**: Mezcla de lógica de visibilidad y estado con su presentación, haciéndolos menos reutilizables.
- **Solución**:
    - **Separación de Lógica y Presentación**: `Modal.jsx` y `PopUpMessage.jsx` deben ser "shells" puramente presentacionales. Deben recibir `isOpen`, `onClose`, y `children` como props. La lógica de cuándo abrir/cerrar y qué contenido mostrar debe ser manejada por el componente padre.
    - **Reutilización**: El contenido dentro del modal/pop-up debe ser inyectado vía `children` para máxima flexibilidad.

### 1.3. Tablas (`tablas/Tabla.jsx`)
- **Problema**: Los componentes de tabla existentes (`TablaHeader.jsx`, `Thgeneral.jsx`, `TdGeneral.jsx`) están separados, lo que puede llevar a una menor cohesión y dificultar la gestión de la estructura de la tabla en un solo lugar.
- **Solución**:
    - **Consolidación en `Tabla.jsx`**: Integrar la funcionalidad de `TablaHeader.jsx`, `Thgeneral.jsx` y `TdGeneral.jsx` directamente en `Tabla.jsx`.
    - **Componente `Tabla.jsx` mejorado**:
        - Aceptará props para `headers` (un array de objetos/strings para los encabezados de la tabla) y `data` (un array de objetos para los datos de la tabla).
        - Renderizará las secciones `<thead>` y `<tbody>` internamente.
        - Aceptará una prop `renderRow` (una función) para permitir la renderización personalizada de las filas de la tabla, ofreciendo flexibilidad para diferentes estructuras de datos y acciones dentro de las filas.
        - El componente será altamente configurable a través de props, permitiendo la renderización dinámica de columnas, contenido de celda personalizado y estilos.
    - **Eliminación de componentes redundantes**: Eliminar `TablaHeader.jsx`, `Thgeneral.jsx` y `TdGeneral.jsx` una vez que su funcionalidad haya sido integrada en `Tabla.jsx`.
    - **Actualización de `index.js`**: Asegurar que `src/components/common/tablas/index.js` solo exporte el nuevo `Tabla.jsx`.
    - **Actualización de usos**: Identificar y actualizar todas las instancias donde se utilizan los componentes de tabla antiguos para que utilicen el nuevo `Tabla.jsx`.

### 1.4. Mensajes de Error y Spinners de Carga (`ErrorMessage.jsx`, `LoadingSpinner.jsx`)
- **Problema**: A veces se les añade lógica condicional o de estado que debería estar en el componente padre.
- **Solución**:
    - **Componentización Atómica**: Deben ser puramente presentacionales, recibiendo `message` (para `ErrorMessage`) o `size`/`color` (para `LoadingSpinner`) como props. Su visibilidad debe ser controlada por el componente padre.

## 2. Componentes de Layout (`src/components/layout/`)

### 2.1. Layout de Página General (`PageLayout.jsx`)
- **Problema**: Puede volverse demasiado complejo si intenta manejar demasiadas variaciones o lógicas específicas de página.
- **Solución**:
    - **Optimización de Layouts**: `PageLayout.jsx` debe definir la estructura general (ej. `Header`, `Footer`, `main content area`). Debe aceptar `children` para el contenido principal y props para configurar `Header`/`Footer` si son dinámicos.
    - **Reutilización**: Evitar lógica de negocio dentro del layout. Si hay variaciones significativas, considerar layouts más específicos (ej. `AdminLayout.jsx`, `AuthLayout.jsx`) que compongan el `PageLayout` base.

### 2.2. Encabezado y Pie de Página (`HeaderPrincipal.jsx`, `Footer.jsx`)
- **Problema**: Contienen navegación compleja, lógica de usuario o enlaces condicionales.
- **Solución**:
    - **Separación de Lógica y Presentación**: Extraer la lógica de navegación y estado de usuario a componentes más pequeños o hooks (ej. `UserMenu.jsx` dentro de `HeaderPrincipal.jsx`).
    - **Componentización Atómica**: Descomponer `HeaderPrincipal.jsx` en sub-componentes (ej. `Logo.jsx`, `NavBar.jsx`, `AuthButtons.jsx`).

### 2.3. Layout de Formulario General (`GeneralFormLayout.jsx`)
- **Problema**: Puede acoplarse a la lógica de envío o validación del formulario.
- **Solución**:
    - **Separación de Lógica y Presentación**: `GeneralFormLayout.jsx` debe proporcionar la estructura visual del formulario, pero no la lógica de manejo de estado. Debe aceptar `children` para los campos y `onSubmit` para el botón de envío. La lógica de validación y envío debe residir en el componente que utiliza este layout.

## 3. Vistas (`src/app/`) y Componentes Específicos de Funcionalidad (`src/components/home/`, `src/components/carrito/`, etc.)

### 3.1. Enfoque General (Contenedores vs. Presentacionales)
- **Problema**: Las vistas y los componentes específicos de funcionalidad a menudo mezclan fetching de datos, manejo de estado y presentación, volviéndose monolíticos.
- **Solución**:
    - **Componentes Contenedor (Smart Components)**: Vistas (`page.jsx`) y componentes de alto nivel. Responsables de fetching de datos, manejo de estado complejo, y pasar datos/callbacks a presentacionales.
    - **Componentes Presentacionales (Dumb Components)**: La mayoría de los componentes en `src/components/`. Reciben datos y callbacks vía `props`, no tienen estado interno (o solo UI local), y no realizan fetching de datos.
    - **Componentización Atómica**: Identificar y extraer sub-elementos reutilizables dentro de componentes más grandes.
    - **Optimización de Layouts**: Asegurar que las vistas utilicen layouts genéricos de manera consistente y solo definan el contenido específico de la página.

### 3.2. Componentes de Carrito (`src/components/carrito/CartComponent.jsx`, `src/components/carrito/CartItem.jsx`)
- **Problema**: `CartComponent.jsx` podría mezclar lógica de negocio del carrito con presentación. `CartItem.jsx` podría tener lógica de actualización de cantidad acoplada.
- **Solución**:
    - **`CartComponent.jsx`**: Convertirlo en un contenedor que maneje la lógica del carrito (usando `useCartStorage` o un contexto) y pase datos/funciones a componentes presentacionales como `CartItemList.jsx` (nuevo) y `CartSummary.jsx` (nuevo).
    - **`CartItem.jsx`**: Puramente presentacional, recibiendo `item`, `onQuantityChange`, `onRemove` como props.

### 3.3. Componentes de Catálogo (`src/components/catalogo/` - ej. `ProductCard.jsx`)
- **Problema**: Mezcla de lógica de añadir al carrito, mostrar detalles y presentación.
- **Solución**:
    - **Componentización Atómica**: Extraer sub-componentes como `ProductImage.jsx`, `ProductName.jsx`, `ProductPrice.jsx`, `AddToCartButton.jsx`.
    - **Separación de Lógica**: `AddToCartButton.jsx` debe ser presentacional, recibiendo un `onClick` callback. La lógica de añadir al carrito debe residir en el componente padre.

### 3.4. Layout Raíz (`src/app/layout.jsx`)
- **Problema**: Si contiene mucha lógica condicional o componentes complejos no estrictamente globales.
- **Solución**:
    - **Optimización de Layouts**: Mantenerlo lo más limpio posible, conteniendo solo elementos verdaderamente globales (`<html>`, `<body>`, `HeaderPrincipal`, `Footer`, `children`). Los proveedores de contexto deben envolver el `children`.

### 3.5. Proveedores de Contexto (`src/context/`)
- **Problema**: Potencial de contener elementos de UI directamente.
- **Solución**: Asegurar que los contextos solo manejen el estado y la lógica de su dominio, exportando proveedores y hooks para consumir el estado, y que la UI que los utiliza esté en componentes separados.

---
**Próximos Pasos:**
Una vez aprobado este plan, procederé a implementar las refactorizaciones propuestas, comenzando por los componentes comunes de mayor reutilización.
